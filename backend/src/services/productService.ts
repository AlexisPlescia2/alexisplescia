import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'

export interface ProductFilters {
  category?: string
  brand?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest'
  page?: number
  limit?: number
}

export async function getProducts(filters: ProductFilters = {}) {
  const {
    category,
    brand,
    search,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = filters

  const where: Prisma.ProductWhereInput = {}

  if (category) {
    where.category = { slug: category }
  }

  if (brand) {
    where.brand = { contains: brand, mode: 'insensitive' }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    }
  }

  const orderBy = (() => {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' as const }
      case 'price_desc':
        return { price: 'desc' as const }
      case 'name_asc':
        return { name: 'asc' as const }
      default:
        return { createdAt: 'desc' as const }
    }
  })()

  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    take: 8,
    include: { category: true },
  })
}
