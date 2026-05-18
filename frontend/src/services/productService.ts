import api from './api'
import { Product, ProductFilters, ProductsResponse, Category } from '../types/product'

function normalizeImages(products: Product[]): Product[] {
  return products.map((p) => ({
    ...p,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
  }))
}

export const productService = {
  async getProducts(params: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>('/products/summary', { params })
    return {
      ...data,
      products: normalizeImages(data.products),
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${slug}`)
    return data
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data } = await api.get<ProductsResponse>('/products/summary', {
      params: { featured: 'true', limit: 8 },
    })
    return normalizeImages(data.products)
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },
}
