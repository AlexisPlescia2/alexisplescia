import { Link, useNavigate } from 'react-router-dom'
import { Product } from '../../types/product'
import { formatPrice } from '../../utils/formatPrice'

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%23444' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E"

interface ProductCardProps {
  product: Product
  showPrice?: boolean
  className?: string
}

export default function ProductCard({ product, showPrice = true, className = '' }: ProductCardProps) {
  const navigate = useNavigate()

  const mainImage = product.images?.[0] || PLACEHOLDER

  return (
    <div className={`group relative card-dark overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 flex flex-col ${className}`}>
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-surface">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            style={{ aspectRatio: '4/3' }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = PLACEHOLDER
            }}
          />
        </div>
      </Link>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        {product.featured && (
          <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs font-mono uppercase tracking-wider rounded border border-gold/30">
            Destacado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`}>
          {product.category && (
            <p className="text-xs font-mono text-gold/60 uppercase tracking-wider mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-body font-semibold text-[#e8e8e8] leading-snug line-clamp-2 group-hover:text-white transition-colors text-sm">
            {product.name}
          </h3>
        </Link>

        {showPrice && (
          <div className="mt-auto pt-3">
            {product.price > 0 ? (
              <span className="font-mono text-accent font-semibold text-base">{formatPrice(product.price)}</span>
            ) : (
              <span className="font-mono text-accent/70 text-xs">{product.brand}</span>
            )}
          </div>
        )}

        <button
          className="btn-primary w-full py-2 text-sm mt-3"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          Ver proyecto →
        </button>
      </div>
    </div>
  )
}
