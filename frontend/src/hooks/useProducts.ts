import { useState, useEffect, useCallback, useRef } from 'react'
import { Product, ProductFilters, ProductsResponse } from '../types/product'
import { productService } from '../services/productService'
import { getCached, setCached, isCacheValid } from '../utils/productsCache'

const EMPTY: ProductsResponse = { products: [], total: 0, page: 1, totalPages: 0 }

function filtersKey(filters: ProductFilters): string {
  return `products:list:${JSON.stringify(filters)}`
}

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<ProductsResponse>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stale, setStale] = useState(false)

  const fetchProducts = useCallback(async (currentFilters: ProductFilters) => {
    const key = filtersKey(currentFilters)
    const cached = getCached<ProductsResponse>(key)
    const valid = isCacheValid(key)

    if (cached && valid) {
      // Serve from cache immediately — no loading spinner
      setData(cached)
      setLoading(false)
      setError(null)
      setStale(false)

      // Background revalidation
      try {
        const fresh = await productService.getProducts(currentFilters)
        const changed = JSON.stringify(fresh) !== JSON.stringify(cached)
        if (changed) {
          setData(fresh)
          setCached(key, fresh)
        }
      } catch {
        // Silently ignore revalidation errors — we already have valid cache
      }
      return
    }

    // Stale cache: show data immediately but mark stale; fetch in background with loading=true only if no stale data
    if (cached && !valid) {
      setData(cached)
      setLoading(false)
      setStale(true)
      setError(null)

      try {
        const fresh = await productService.getProducts(currentFilters)
        setData(fresh)
        setCached(key, fresh)
        setStale(false)
      } catch {
        // Keep stale data visible; surface no error since we have something to show
      }
      return
    }

    // No cache at all — normal fetch
    setLoading(true)
    setError(null)
    setStale(false)
    try {
      const result = await productService.getProducts(currentFilters)
      setData(result)
      setCached(key, result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Track previous filter key to avoid stale closure issues on filter change
  const prevKeyRef = useRef<string>('')

  useEffect(() => {
    const key = filtersKey(filters)
    if (key !== prevKeyRef.current) {
      prevKeyRef.current = key
      // Reset to loading only if we have no cache for these filters
      if (!getCached(key)) {
        setData(EMPTY)
        setLoading(true)
      }
    }
    fetchProducts(filters)
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
    stale,
  }
}

export function useFeaturedProducts() {
  const FEATURED_KEY = 'products:featured'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCached<Product[]>(FEATURED_KEY)
    const valid = isCacheValid(FEATURED_KEY)

    if (cached && valid) {
      setProducts(cached)
      setLoading(false)
      // Background revalidation
      productService
        .getFeaturedProducts()
        .then((fresh) => {
          if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
            setProducts(fresh)
            setCached(FEATURED_KEY, fresh)
          }
        })
        .catch(() => {/* ignore */})
      return
    }

    if (cached && !valid) {
      // Show stale immediately while fetching fresh
      setProducts(cached)
      setLoading(false)
      productService
        .getFeaturedProducts()
        .then((fresh) => {
          setProducts(fresh)
          setCached(FEATURED_KEY, fresh)
        })
        .catch(console.error)
      return
    }

    // No cache
    productService
      .getFeaturedProducts()
      .then((data) => {
        setProducts(data)
        setCached(FEATURED_KEY, data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
