import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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

const POWER_BI_SVG = (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="#F2C811">
    <path d="M16.406 2.678c0-.74.6-1.34 1.34-1.34s1.34.6 1.34 1.34v18.644c0 .74-.6 1.34-1.34 1.34s-1.34-.6-1.34-1.34zm-4.04 2.678c0-.74.6-1.34 1.34-1.34s1.34.6 1.34 1.34v13.288c0 .74-.6 1.34-1.34 1.34s-1.34-.6-1.34-1.34zm-4.04 3.352c0-.74.6-1.34 1.34-1.34s1.34.6 1.34 1.34v6.584c0 .74-.6 1.34-1.34 1.34s-1.34-.6-1.34-1.34zm-4.04 2.678c0-.74.6-1.34 1.34-1.34s1.34.6 1.34 1.34v1.228c0 .74-.6 1.34-1.34 1.34s-1.34-.6-1.34-1.34z"/>
  </svg>
)

const SKILLS_STRIP: { name: string; icon?: string; color?: string; svg?: React.ReactNode }[] = [
  { name: 'Python',        icon: 'python',       color: '3776AB' },
  { name: 'React',         icon: 'react',         color: '61DAFB' },
  { name: 'Node.js',       icon: 'nodedotjs',     color: '339933' },
  { name: 'TypeScript',    icon: 'typescript',    color: '3178C6' },
  { name: 'SQL',           icon: 'postgresql',    color: '4169E1' },
  { name: 'Power BI',      svg: POWER_BI_SVG },
  { name: 'Looker Studio', icon: 'looker',        color: '4285F4' },
  { name: 'Docker',        icon: 'docker',        color: '2496ED' },
]

const SKILLS = [
  { area: 'Frontend', items: ['React', 'Vite', 'TypeScript', 'TailwindCSS', 'HTML/CSS'] },
  { area: 'Backend', items: ['Node.js', 'Express', 'Python', 'Flask', 'Django'] },
  { area: 'Datos', items: ['Power BI', 'Looker Studio', 'Excel', 'Google Sheets', 'SQL'] },
  { area: 'DevOps', items: ['Docker', 'Git', 'Railway', 'Vercel', 'PM2', 'Nginx'] },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const springBase = { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.9 }
const springFast = { type: 'spring' as const, stiffness: 400, damping: 30 }

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
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.018] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.p
            className="label-caps mb-8 block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springBase, delay: 0.1 }}
          >
            Desarrollador Full Stack & Analista de Datos
          </motion.p>

          <motion.h1
            className="font-display text-[4.5rem] sm:text-[7rem] md:text-[10rem] text-[#e8e8e8] font-bold tracking-tight leading-none mb-1"
            style={{ letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springBase, delay: 0.18 }}
          >
            ALEXIS
          </motion.h1>
          <motion.h2
            className="font-display text-[3rem] sm:text-[5rem] md:text-[7rem] text-accent font-bold tracking-tight leading-none mb-12"
            style={{ letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springBase, delay: 0.26 }}
          >
            PLESCIA
          </motion.h2>

          <motion.p
            className="text-lg text-[#e8e8e8]/40 max-w-lg mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springBase, delay: 0.36 }}
          >
            Construyo aplicaciones web, analizo datos y creo soluciones que funcionan. Buenos Aires, Argentina.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springBase, delay: 0.44 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springFast}>
              <Link to="/shop" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
                Ver proyectos
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springFast}>
              <Link to="/contact" className="btn-ghost text-sm px-8 py-3 border border-border inline-flex items-center">
                Contactarme
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-white tracking-widest uppercase whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Tecnologías
        </motion.p>
      </section>

      {/* ── Skills strip ── */}
      <motion.section
        className="border-y border-border bg-surface py-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-around max-w-5xl mx-auto px-4 flex-wrap gap-5">
          {SKILLS_STRIP.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="flex items-center gap-2 whitespace-nowrap"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              {skill.svg
                ? skill.svg
                : <img src={`https://cdn.simpleicons.org/${skill.icon}/${skill.color}`} alt={skill.name} className="w-4 h-4" />
              }
              <span className="font-mono text-[11px] text-white uppercase tracking-widest">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Categories ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={springBase}
          >
            <div>
              <span className="label-caps block mb-2">Explorá por tecnología</span>
              <h2 className="section-title">Categorías</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm text-accent hover:text-blue-400 transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              Ver todo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-card" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              {displayCategories.map((cat) => (
                <motion.div key={cat.slug} variants={fadeUp} transition={springBase}>
                  <motion.div whileHover={{ scale: 1.025, y: -2 }} whileTap={{ scale: 0.98 }} transition={springFast}>
                    <Link
                      to={`/shop?category=${cat.slug}`}
                      className="group relative card-dark p-5 hover:border-accent/30 flex flex-col gap-2 block h-full"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm text-[#e8e8e8] group-hover:text-accent transition-colors tracking-tight">
                          {cat.name}
                        </h3>
                        {cat.count !== undefined && (
                          <p className="text-xs font-mono text-[#e8e8e8]/30 mt-0.5">
                            {cat.count} proyecto{cat.count !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Proyectos Destacados ── */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={springBase}
          >
            <div>
              <span className="label-caps block mb-2">Los más recientes</span>
              <h2 className="section-title">Proyectos</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm text-accent hover:text-blue-400 transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-dark overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-surface" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
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
                <motion.div
                  className={isFew ? 'flex flex-wrap justify-center gap-5' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'}
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  {featured.slice(0, 4).map((product) => (
                    <motion.div key={product.id} variants={fadeUp} transition={springBase}
                      className={isFew ? 'w-full sm:w-72' : ''}>
                      <motion.div whileHover={{ y: -4 }} transition={springFast}>
                        <ProductCard product={product} showPrice={false} />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )
            })()
          ) : (
            <div className="text-center py-12">
              <p className="text-sm font-mono text-[#e8e8e8]/25">
                Ejecutá el seed para ver proyectos aquí
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Skills detallado ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={springBase}
          >
            <span className="label-caps block mb-2">Tecnologías</span>
            <h2 className="section-title">Skills</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {SKILLS.map((group) => (
              <motion.div key={group.area} variants={fadeUp} transition={springBase}>
                <motion.div whileHover={{ y: -2 }} transition={springFast} className="card-dark p-6 h-full">
                  <h3 className="font-semibold text-accent text-sm mb-4 tracking-tight">{group.area}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono text-[#e8e8e8]/50" style={{ borderRadius: '4px' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={springBase}
          >
            <div className="card-dark p-12 border-accent/10 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] to-transparent pointer-events-none" />
              <h2 className="section-title text-3xl md:text-4xl mb-4 relative">
                ¿Trabajamos juntos?
              </h2>
              <p className="text-[#e8e8e8]/40 mb-8 max-w-sm mx-auto relative text-sm leading-relaxed">
                Disponible para proyectos freelance y posiciones full-time.
              </p>
              <div className="flex gap-3 justify-center flex-wrap relative">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springFast}>
                  <a
                    href="https://www.linkedin.com/in/alexisplescia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-7 py-3 text-sm"
                  >
                    Ver mi LinkedIn
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springFast}>
                  <Link to="/contact" className="btn-secondary px-7 py-3 text-sm">
                    Escribime
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
