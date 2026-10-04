import { useState, useEffect } from 'react'
import { Category } from '../types/product'
import { productService } from '../services/productService'
import { getCached, setCached, isCacheValid } from '../utils/productsCache'

const CATEGORIES_KEY = 'categories:list'

/**
 * Categorías con stale-while-revalidate (mismo patrón que los productos).
 * El estado inicial se lee del cache de forma síncrona, así la primera
 * renderización ya tiene datos si el usuario visitó el sitio antes y no
 * depende de que el backend de Render esté despierto.
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(
    () => getCached<Category[]>(CATEGORIES_KEY) ?? [],
  )
  const [loading, setLoading] = useState(() => getCached(CATEGORIES_KEY) === null)

  useEffect(() => {
    const cached = getCached<Category[]>(CATEGORIES_KEY)
    // Cache vigente: no hace falta pegarle al backend
    if (cached && isCacheValid(CATEGORIES_KEY)) return

    let cancelled = false
    productService
      .getCategories()
      .then((fresh) => {
        if (cancelled) return
        setCategories(fresh)
        setCached(CATEGORIES_KEY, fresh)
      })
      .catch(() => {
        /* si falla, quedan las del cache o el fallback del componente */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, loading }
}
