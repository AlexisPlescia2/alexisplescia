import { Product } from '../../types/product'
import ProductCard from './ProductCard'

function SkeletonCard() {
  return (
    <div className="card-dark overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-surface" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-surface rounded w-1/3" />
        <div className="h-4 bg-surface rounded w-3/4" />
        <div className="h-3 bg-surface rounded w-1/2" />
        <div className="h-5 bg-surface rounded w-1/3 mt-3" />
        <div className="h-9 bg-surface rounded mt-2" />
      </div>
    </div>
  )
}

interface ProductGridProps {
  products: Product[]
  loading: boolean
  skeletonCount?: number
}

export default function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-24">
        <svg
          className="w-16 h-16 text-[#e8e8e8]/10 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="font-display text-2xl tracking-widest text-[#e8e8e8]/20 uppercase">
          No se encontraron productos
        </p>
        <p className="text-sm text-[#e8e8e8]/20 mt-2 font-body">
          Probá con otros filtros o términos de búsqueda
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
