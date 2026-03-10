export interface Category {
  id: string
  name: string
  slug: string
  image?: string
  _count?: { products: number }
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number | null
  onSale?: boolean
  stock: number
  images: string[]
  features: string[]
  projectUrl?: string | null
  brand: string
  featured: boolean
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  category?: string
  brand?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  onSale?: boolean
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest'
  page?: number
  limit?: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}
