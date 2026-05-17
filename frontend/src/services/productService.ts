import api from './api'
import { Product, ProductFilters, ProductsResponse, Category } from '../types/product'

// The summary endpoint returns images as {url, alt}[] — normalize to string[]
function normalizeImages(
  products: Array<Product & { images: Array<{ url: string; alt?: string }> | string[] }>
): Product[] {
  return products.map((p) => ({
    ...p,
    images: Array.isArray(p.images)
      ? p.images.map((img) =>
          typeof img === 'string' ? img : (img as { url: string }).url
        )
      : [],
  }))
}

export const productService = {
  async getProducts(params: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>('/products/summary', { params })
    return {
      ...data,
      products: normalizeImages(data.products as Parameters<typeof normalizeImages>[0]),
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${slug}`)
    return data
  },

  async getFeaturedProducts(): Promise<Product[]> {
    // Use the lightweight summary endpoint with featured=true
    const { data } = await api.get<ProductsResponse>('/products/summary', {
      params: { featured: 'true', limit: 8 },
    })
    return normalizeImages(data.products as Parameters<typeof normalizeImages>[0])
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },
}
