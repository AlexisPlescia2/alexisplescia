import api from './api'
import { Product, ProductFilters, ProductsResponse, Category } from '../types/product'

export const productService = {
  async getProducts(params: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>('/products', { params })
    return data
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${slug}`)
    return data
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data } = await api.get<Product[]>('/products/featured')
    return data
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },
}
