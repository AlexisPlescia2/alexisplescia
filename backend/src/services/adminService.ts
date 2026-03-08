import { prisma } from '../config/prisma'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ─── STATS ─────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [totalProducts, totalCustomers, totalMessages, categories] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.contactMessage.count(),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
  ])

  // Low stock (projects with stock < 1 — mostly won't happen but keep the check)
  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lt: 1 } },
    select: { name: true, stock: true },
    orderBy: { stock: 'asc' },
  })

  // Projects by category for the pie chart (use project count instead of revenue)
  const salesByCategory = categories.map((cat) => ({
    category: cat.name,
    revenue: cat._count.products,
    count: cat._count.products,
    percentage: totalProducts > 0 ? Math.round((cat._count.products / totalProducts) * 100) : 0,
  })).filter((c) => c.count > 0)

  // Recent contact messages as "recent orders" equivalent
  const recentMessages = await prisma.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  const recentOrders = recentMessages.map((m) => ({
    id: m.id,
    createdAt: m.createdAt.toISOString(),
    status: m.read ? 'CONFIRMED' : 'PENDING',
    total: 0,
    user: { name: m.name, email: m.email },
  }))

  // Monthly activity placeholder (projects created per month for last 12 months)
  const now = new Date()
  const months: Record<string, { revenue: number; orders: number }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months[key] = { revenue: 0, orders: 0 }
  }
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const monthlySales = Object.entries(months).map(([key, data]) => {
    const [year, month] = key.split('-')
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year}`,
      revenue: data.revenue,
      orders: data.orders,
    }
  })

  // Daily placeholder
  const dailySalesArr = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dailySalesArr.push({ date: d.toISOString().split('T')[0], revenue: 0, orders: 0 })
  }

  // Top projects (featured ones)
  const featuredProjects = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 10,
  })
  const topProducts = featuredProjects.map((p) => ({
    name: p.name,
    category: p.category?.name || '',
    totalSold: 1,
    revenue: 0,
  }))

  return {
    totalRevenue: 0,
    totalOrders: totalMessages,
    totalProducts,
    totalCustomers,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersByStatus: [
      { status: 'PENDING', count: totalMessages },
    ],
    topProducts,
    salesByCategory,
    monthlySales,
    dailySales: dailySalesArr,
    lowStockProducts,
    recentOrders,
  }
}

// ─── PRODUCTS ──────────────────────────────────────────────────────────────

export async function adminGetProducts(search?: string) {
  const where = search
    ? { name: { contains: search, mode: 'insensitive' as const } }
    : {}
  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function adminCreateProduct(data: {
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  categoryId: string
  brand: string
  images: string[]
  featured?: boolean
  onSale?: boolean
}) {
  const slug = slugify(data.name)
  const existing = await prisma.product.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  return prisma.product.create({
    data: {
      ...data,
      slug: finalSlug,
      featured: data.featured ?? false,
      onSale: data.onSale ?? false,
    },
    include: { category: true },
  })
}

export async function adminUpdateProduct(
  id: string,
  data: Partial<{
    name: string
    description: string
    price: number
    comparePrice: number | null
    stock: number
    categoryId: string
    brand: string
    images: string[]
    featured: boolean
    onSale: boolean
  }>,
) {
  const updateData: Record<string, unknown> = { ...data }
  if (data.name) {
    updateData.slug = slugify(data.name)
  }
  return prisma.product.update({
    where: { id },
    data: updateData,
    include: { category: true },
  })
}

export async function adminDeleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────

export async function adminGetCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
}

export async function adminCreateCategory(data: { name: string; image?: string }) {
  const slug = slugify(data.name)
  return prisma.category.create({ data: { name: data.name, slug, image: data.image } })
}

export async function adminUpdateCategory(id: string, data: { name?: string; image?: string }) {
  const updateData: Record<string, unknown> = { ...data }
  if (data.name) updateData.slug = slugify(data.name)
  return prisma.category.update({ where: { id }, data: updateData })
}

export async function adminDeleteCategory(id: string) {
  const count = await prisma.product.count({ where: { categoryId: id } })
  if (count > 0) {
    const err: Error & { statusCode?: number } = new Error(
      `No se puede eliminar: tiene ${count} proyecto(s) asociado(s)`,
    )
    err.statusCode = 409
    throw err
  }
  return prisma.category.delete({ where: { id } })
}
