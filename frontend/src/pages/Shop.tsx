import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import CasoCard, { AvisoFicticio } from '../components/casos/CasoCard'
import { CATEGORIAS_CASOS, casosOrdenados, categoriaSlug } from '../data/casos'

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
}

const chip = (active: boolean) =>
  `text-xs font-mono px-4 py-1.5 rounded-full border transition-colors ${
    active
      ? 'bg-accent border-accent text-white'
      : 'border-border text-[#e8e8e8]/50 hover:text-[#e8e8e8] hover:border-[#e8e8e8]/30'
  }`

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const activeSlug = params.get('category') ?? undefined
  const active = CATEGORIAS_CASOS.find((c) => categoriaSlug(c.nombre) === activeSlug)?.nombre

  const casos = active ? casosOrdenados.filter((c) => c.categoria === active) : casosOrdenados

  useEffect(() => {
    document.title = 'Proyectos — Alexis Plescia'
  }, [])

  const select = (slug?: string) => setParams(slug ? { category: slug } : {}, { replace: true })

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Casos de estudio</p>
          <h1 className="section-title">Proyectos</h1>
          <p className="text-[#e8e8e8]/50 mt-4 max-w-2xl leading-relaxed">
            Cada caso cuenta el problema, qué hice, cómo lo hice y qué resultado tuvo, con capturas y archivos de ejemplo
            para descargar.
          </p>
        </div>

        <AvisoFicticio className="mb-8 max-w-2xl" />

        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => select()} className={chip(!active)}>
            Todos
          </button>
          {CATEGORIAS_CASOS.map((c) => (
            <button key={c.nombre} onClick={() => select(categoriaSlug(c.nombre))} className={chip(active === c.nombre)}>
              {c.nombre}
            </button>
          ))}
        </div>

        <motion.div
          key={active ?? 'todos'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {casos.map((caso) => (
            <motion.div key={caso.slug} variants={itemVariants}>
              <CasoCard caso={caso} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
