import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Product } from '../types/product'
import { productService } from '../services/productService'
import { PageLoader } from '../components/ui/Loader'
import ProductCard from '../components/product/ProductCard'

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' fill='%23444' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E"

function SkeletonDetail() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="aspect-[4/3] bg-surface rounded-lg" />
      <div className="space-y-4">
        <div className="h-3 bg-surface rounded w-1/4" />
        <div className="h-8 bg-surface rounded w-3/4" />
        <div className="h-3 bg-surface rounded w-1/3" />
        <div className="h-6 bg-surface rounded w-1/4 mt-4" />
        <div className="h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-5/6" />
        <div className="h-12 bg-surface rounded mt-6" />
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setProduct(null)
    setRelated([])
    setActiveImg(0)

    productService
      .getProductBySlug(slug)
      .then(async (p) => {
        setProduct(p)
        document.title = `${p.name} — Alexis Plescia`
        if (p.category) {
          const res = await productService.getProducts({ category: p.category.slug, limit: 5 })
          setRelated(res.products.filter((r) => r.id !== p.id).slice(0, 4))
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <PageLoader />

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-5xl tracking-widest text-[#e8e8e8]/20 mb-4">PROYECTO NO ENCONTRADO</h1>
          <Link to="/shop" className="btn-primary">Ver proyectos</Link>
        </div>
      </div>
    )
  }

  const mainImage = product.images?.[activeImg] || PLACEHOLDER

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-body text-[#e8e8e8]/40 mb-8">
          <Link to="/" className="hover:text-[#e8e8e8] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#e8e8e8] transition-colors">Proyectos</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-[#e8e8e8] transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#e8e8e8]/70 line-clamp-1">{product.name}</span>
        </nav>

        {/* Project */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface mb-3">
              <img
                src={mainImage}
                alt={product.name}
                loading="eager"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                style={{ aspectRatio: '4/3' }}
                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-accent' : 'border-white/10'}`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <Link to={`/shop?category=${product.category.slug}`} className="text-xs font-mono text-gold/70 uppercase tracking-widest hover:text-gold transition-colors mb-2 self-start">
                {product.category.name}
              </Link>
            )}

            {product.featured && (
              <span className="inline-flex mb-2 px-2 py-0.5 bg-gold/20 text-gold text-xs font-mono uppercase tracking-wider rounded w-fit border border-gold/30">
                DESTACADO
              </span>
            )}

            <h1 className="font-display text-3xl md:text-4xl tracking-widest text-[#e8e8e8] leading-tight mb-2">
              {product.name.toUpperCase()}
            </h1>

            <p className="text-sm text-accent/80 font-mono mb-6">{product.brand}</p>

            <p className="font-body text-[#e8e8e8]/60 leading-relaxed mb-8 flex-1">{product.description}</p>

            <div className="flex gap-3 flex-wrap">
              {product.githubUrl && (
                <a
                  href={product.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-3 flex-1 text-center"
                >
                  Ver en GitHub →
                </a>
              )}
              {product.projectUrl && (
                <a
                  href={product.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-3 flex-1 text-center"
                >
                  Ir a la web →
                </a>
              )}
              <Link to="/shop" className="btn-secondary px-8 py-3 flex-1 text-center">
                Volver a proyectos
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <div className="border-t border-border pt-12 mb-8">
              <h2 className="section-title text-2xl">Proyectos Relacionados</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
