import { prisma } from '../config/prisma'

export async function getAllCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  })
}
