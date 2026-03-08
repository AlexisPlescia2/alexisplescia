import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Category } from '../types/product'
import { productService } from '../services/productService'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/product/ProductGrid'
import Filters, { FilterValues } from '../components/product/Filters'
import SearchBar from '../components/product/SearchBar'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre A–Z' },
] as const

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

  // Leer filtros actuales de la URL
  const category = searchParams.get('category') || undefined
  const brand = searchParams.get('brand') || undefined
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const minPrice = searchParams.get('minPrice')
    ? parseFloat(searchParams.get('minPrice')!)
    : undefined
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice')!)
    : undefined

  const { products, total, totalPages, loading } = useProducts({
    category,
    brand,
    search: searchParams.get('search') || undefined,
    sort: sort as 'price_asc' | 'price_desc' | 'name_asc' | 'newest',
    page,
    minPrice,
    maxPrice,
  })

  // Cargar categorías
  useEffect(() => {
    productService.getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    document.title = 'Catálogo — Prometeo Tattoo'
  }, [])

  // Sync búsqueda a URL con debounce (SearchBar ya hace el debounce)
  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchValue(val)
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (val) params.set('search', val)
          else params.delete('search')
          params.set('page', '1')
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const handleSort = (newSort: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      params.set('sort', newSort)
      params.set('page', '1')
      return params
    })
  }

  const handleFiltersChange = useCallback(
    (values: FilterValues) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)

        if (values.category) params.set('category', values.category)
        else params.delete('category')

        if (values.brand) params.set('brand', values.brand)
        else params.delete('brand')

        if (values.minPrice !== undefined) params.set('minPrice', String(values.minPrice))
        else params.delete('minPrice')

        if (values.maxPrice !== undefined) params.set('maxPrice', String(values.maxPrice))
        else params.delete('maxPrice')

        params.set('page', '1')
        return params
      })
    },
    [setSearchParams],
  )

  const handlePage = (newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      params.set('page', String(newPage))
      return params
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filterValues: FilterValues = { category, brand, minPrice, maxPrice }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-1">
              {total > 0 && !loading ? `${total} productos` : ' '}
            </p>
            <h1 className="section-title text-3xl md:text-4xl">Catálogo</h1>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            {/* Mobile: botón filtros */}
            <button
              className="md:hidden btn-ghost border border-border text-sm py-2 px-4"
              onClick={() => setFiltersOpen(true)}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z" />
              </svg>
              Filtros
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="input-field py-2 text-sm w-auto cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-card">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SearchBar */}
        <div className="mb-6">
          <SearchBar value={searchValue} onChange={handleSearchChange} />
        </div>

        {/* Content grid */}
        <div className="flex gap-8 items-start">
          {/* Sidebar — desktop */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <div className="card-dark p-5 sticky top-24">
              <Filters
                categories={categories}
                values={filterValues}
                onChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page === 1}
                  className="btn-ghost border border-border px-4 py-2 text-sm disabled:opacity-30"
                >
                  ← Anterior
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    const p = i + 1
                    return (
                      <button
                        key={p}
                        onClick={() => handlePage(p)}
                        className={`w-9 h-9 text-sm font-mono rounded transition-colors ${
                          p === page
                            ? 'bg-accent text-white'
                            : 'text-[#e8e8e8]/50 hover:text-[#e8e8e8] hover:bg-surface'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page === totalPages}
                  className="btn-ghost border border-border px-4 py-2 text-sm disabled:opacity-30"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters modal */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative bg-card border-t border-border w-full max-h-[85vh] overflow-y-auto rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display tracking-widest text-[#e8e8e8] text-lg">FILTROS</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-[#e8e8e8]/60 hover:text-[#e8e8e8] p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Filters
              categories={categories}
              values={filterValues}
              onChange={(vals) => {
                handleFiltersChange(vals)
                setFiltersOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
