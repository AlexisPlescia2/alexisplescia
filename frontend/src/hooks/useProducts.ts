import { useState, useEffect, useCallback } from 'react'
import { Product, ProductFilters, ProductsResponse } from '../types/product'
import { productService } from '../services/productService'

const EMPTY: ProductsResponse = { products: [], total: 0, page: 1, totalPages: 0 }

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<ProductsResponse>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (currentFilters: ProductFilters) => {
    setLoading(true)
    setError(null)
    try {
      const result = await productService.getProducts(currentFilters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(filters)
  // Los filtros vienen de la URL (Shop.tsx), comparamos cada campo por separado
  // para evitar que un objeto nuevo con los mismos valores dispare un fetch extra
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.category,
    filters.brand,
    filters.search,
    filters.sort,
    filters.page,
    filters.minPrice,
    filters.maxPrice,
    fetchProducts,
  ])

  return {
    products: data.products,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    loading,
    error,
  }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService
      .getFeaturedProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
