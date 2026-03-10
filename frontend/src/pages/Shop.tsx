import { useState, useEffect } from 'react'
import { Category } from '../types/product'
import { productService } from '../services/productService'
import { useProducts } from '../hooks/useProducts'
import ProjectShowcase from '../components/product/ProjectShowcase'

export default function Shop() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined)

  const { products, loading } = useProducts({
    category: activeCategory,
    sort: 'newest',
    limit: 20,
  })

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    document.title = 'Proyectos — Alexis Plescia'
  }, [])

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Mi trabajo</p>
          <h1 className="section-title">Proyectos</h1>
        </div>

        {/* Filtro por categoría */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(undefined)}
              className={`text-xs font-mono px-4 py-1.5 rounded-full border transition-colors ${
                !activeCategory
                  ? 'bg-accent border-accent text-white'
                  : 'border-border text-[#e8e8e8]/50 hover:text-[#e8e8e8] hover:border-[#e8e8e8]/30'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`text-xs font-mono px-4 py-1.5 rounded-full border transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-accent border-accent text-white'
                    : 'border-border text-[#e8e8e8]/50 hover:text-[#e8e8e8] hover:border-[#e8e8e8]/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-dark overflow-hidden animate-pulse">
                <div className="w-full aspect-video bg-surface" />
                <div className="p-8 space-y-4">
                  <div className="h-3 bg-surface rounded w-20" />
                  <div className="h-6 bg-surface rounded w-64" />
                  <div className="h-4 bg-surface rounded w-full" />
                  <div className="h-4 bg-surface rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Proyectos */}
        {!loading && products.length > 0 && (
          <div className="space-y-12">
            {products.map((project, i) => (
              <ProjectShowcase key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Vacío */}
        {!loading && products.length === 0 && (
          <div className="card-dark p-16 text-center">
            <p className="font-mono text-[#e8e8e8]/30 text-sm">No hay proyectos en esta categoría.</p>
          </div>
        )}

      </div>
    </div>
  )
}
