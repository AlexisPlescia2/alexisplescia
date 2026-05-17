import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Category } from '../types/product'
import { productService } from '../services/productService'
import { useProducts } from '../hooks/useProducts'
import { useSlowFetchMessage } from '../hooks/useSlowFetchMessage'
import ProjectShowcase from '../components/product/ProjectShowcase'

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

export default function Shop() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined)

  const { products, loading } = useProducts({
    category: activeCategory,
    sort: 'newest',
    limit: 20,
  })
  const isSlowFetch = useSlowFetchMessage(loading)

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    document.title = 'Proyectos — Alexis Plescia'
  }, [])

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">

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

        {/* Slow fetch message */}
        {isSlowFetch && (
          <p className="text-xs font-mono text-[#e8e8e8]/30 mb-6 text-center tracking-wide">
            Despertando el servidor, un momento...
          </p>
        )}

        {/* Loading skeleton — no motion during load */}
        {loading && (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden animate-pulse flex" style={{ background: '#111111', border: '1px solid #222', borderRadius: 8 }}>
                <div className="p-8 lg:p-10 lg:w-1/2 space-y-4">
                  <div className="h-3 rounded w-20" style={{ background: '#1a1a1a' }} />
                  <div className="h-8 rounded w-64" style={{ background: '#1a1a1a' }} />
                  <div className="h-4 rounded w-full" style={{ background: '#1a1a1a' }} />
                  <div className="h-4 rounded w-3/4" style={{ background: '#1a1a1a' }} />
                  <div className="space-y-2 pt-2">
                    {[1, 2, 3].map(j => <div key={j} className="h-3 rounded w-full" style={{ background: '#1a1a1a' }} />)}
                  </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 min-h-[380px]" style={{ background: '#141414' }} />
              </div>
            ))}
          </div>
        )}

        {/* Proyectos — stagger animation after data arrives */}
        {!loading && products.length > 0 && (
          <motion.div
            className="space-y-12"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {products.map((project, i) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectShowcase project={project} index={i} />
              </motion.div>
            ))}
          </motion.div>
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
