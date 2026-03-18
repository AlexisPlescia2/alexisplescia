import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Category } from '../types/product'
import { productService } from '../services/productService'
import { useFeaturedProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import { Skeleton } from '../components/ui/Loader'

const FALLBACK_CATEGORIES = [
  { name: 'Apps Web', slug: 'web-apps', icon: '🌐' },
  { name: 'Análisis de Datos', slug: 'data-analysis', icon: '📊' },
  { name: 'Dashboards', slug: 'dashboards', icon: '📈' },
  { name: 'Backend & APIs', slug: 'backend', icon: '⚙️' },
  { name: 'Automatización', slug: 'automatizacion', icon: '🤖' },
  { name: 'E-Commerce', slug: 'ecommerce', icon: '🛒' },
  { name: 'DevOps', slug: 'devops', icon: '🚀' },
  { name: 'IA & Datos', slug: 'ia-datos', icon: '🧠' },
]

const CATEGORY_ICONS: Record<string, string> = {
  'web-apps': '🌐',
  'data-analysis': '📊',
  dashboards: '📈',
  backend: '⚙️',
  automatizacion: '🤖',
  ecommerce: '🛒',
  mobile: '📱',
  devops: '🚀',
  'ia-datos': '🧠',
  otros: '📦',
}

const SKILLS_STRIP = ['Python', 'React', 'Node.js', 'SQL', 'Power BI', 'Looker Studio', 'TypeScript', 'Docker']

const SKILLS = [
  { area: 'Frontend', items: ['React', 'Vite', 'TypeScript', 'TailwindCSS', 'HTML/CSS'] },
  { area: 'Backend', items: ['Node.js', 'Express', 'Python', 'Flask', 'Django'] },
  { area: 'Datos', items: ['Power BI', 'Looker Studio', 'Excel', 'Google Sheets', 'SQL'] },
  { area: 'DevOps', items: ['Docker', 'Git', 'Railway', 'Vercel', 'PM2', 'Nginx'] },
]

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const { products: featured, loading: featuredLoading } = useFeaturedProducts()

  useEffect(() => {
    document.title = 'Alexis Plescia — Portfolio'
    productService
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false))
  }, [])

  type DisplayCat = { slug: string; name: string; icon: string; count?: number }

  const displayCategories: DisplayCat[] =
    categories.length > 0
      ? categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          icon: CATEGORY_ICONS[c.slug] || '📦',
          count: c._count?.products,
        }))
      : FALLBACK_CATEGORIES.map((c) => ({ ...c, count: undefined }))

  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-background to-background pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <p className="font-mono text-gold/70 text-xs tracking-[0.4em] uppercase mb-8">
            Desarrollador Full Stack & Analista de Datos
          </p>

          <h1 className="font-display text-[5rem] sm:text-[8rem] md:text-[11rem] text-[#e8e8e8] tracking-widest leading-none mb-2">
            ALEXIS
          </h1>
          <h2 className="font-display text-[3.5rem] sm:text-[5.5rem] md:text-[7.5rem] text-accent tracking-widest leading-none mb-12">
            PLESCIA
          </h2>

          <p className="font-body text-lg text-[#e8e8e8]/40 max-w-xl mx-auto mb-10">
            Construyo aplicaciones web, analizo datos y creo soluciones que funcionan. Buenos Aires, Argentina.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary text-base px-10 py-4">
              Ver proyectos
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-ghost text-base px-10 py-4 border border-border">
              Contactarme
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs font-mono tracking-widest uppercase text-[#e8e8e8]/40">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
        </div>
      </section>

      {/* ── Skills strip ── */}
      <section className="border-y border-border bg-surface py-5">
        <div className="flex items-center justify-around max-w-7xl mx-auto px-4 flex-wrap gap-4">
          {SKILLS_STRIP.map((skill) => (
            <span
              key={skill}
              className="font-mono text-xs text-[#e8e8e8]/25 uppercase tracking-widest whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">
                Explorá por tecnología
              </p>
              <h2 className="section-title">Categorías</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-body text-accent hover:text-blue-400 transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              Ver todo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/shop?category=${cat.slug}`}
                  className="group relative card-dark p-5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 flex flex-col gap-2"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-display tracking-widest text-lg text-[#e8e8e8] group-hover:text-accent transition-colors">
                      {cat.name.toUpperCase()}
                    </h3>
                    {cat.count !== undefined && (
                      <p className="text-xs font-mono text-[#e8e8e8]/30 mt-0.5">
                        {cat.count} proyecto{cat.count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Proyectos Destacados ── */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">
                Los más recientes
              </p>
              <h2 className="section-title">Proyectos Destacados</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-body text-accent hover:text-blue-400 transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-dark overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-surface" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-1/3 mt-3" />
                    <Skeleton className="h-9 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            (() => {
              const count = Math.min(featured.length, 4)
              const isFew = count < 3
              return (
                <div className={isFew ? 'flex flex-wrap justify-center gap-5' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'}>
                  {featured.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showPrice={false}
                      className={isFew ? 'w-full sm:w-72' : ''}
                    />
                  ))}
                </div>
              )
            })()
          ) : (
            <div className="text-center py-12">
              <p className="text-sm font-mono text-[#e8e8e8]/30">
                Ejecutá el seed para ver proyectos aquí
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Skills detallado ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Tecnologías</p>
            <h2 className="section-title">Skills</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILLS.map((group) => (
              <div key={group.area} className="card-dark p-6">
                <h3 className="font-display tracking-widest text-accent text-lg mb-4">{group.area.toUpperCase()}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono text-[#e8e8e8]/60">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="card-dark p-12 border-accent/20 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            <h2 className="font-display text-4xl md:text-5xl tracking-widest text-[#e8e8e8] mb-4 relative">
              ¿TRABAJAMOS JUNTOS?
            </h2>
            <p className="font-body text-[#e8e8e8]/50 mb-8 max-w-md mx-auto relative">
              Estoy disponible para proyectos freelance y posiciones full-time.
            </p>
            <div className="flex gap-4 justify-center flex-wrap relative">
              <a
                href="https://www.linkedin.com/in/alexisplescia/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-3"
              >
                Ver mi CV
              </a>
              <Link to="/contact" className="btn-secondary px-8 py-3">
                Escribime
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
