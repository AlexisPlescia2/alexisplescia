import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getCaso, casosOrdenados, categoriaSlug } from '../data/casos'
import CasoCard, { RichText, AvisoFicticio } from '../components/casos/CasoCard'

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-[#e8e8e8] tracking-tight mb-3">{titulo}</h2>
      <div className="text-[15px] text-[#e8e8e8]/65 leading-relaxed">{children}</div>
    </section>
  )
}

function Lista({ items }: { items: string[] }) {
  if (items.length === 1) return <p><RichText text={items[0]} /></p>
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex gap-2.5">
          <span className="text-accent/70 shrink-0 mt-0.5">›</span>
          <span>
            <RichText text={it} />
          </span>
        </li>
      ))}
    </ul>
  )
}

const EXT_ICON: Record<string, string> = { xlsx: '📗', py: '🐍', gs: '📜', txt: '📄' }

export default function CasoDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const caso = getCaso(slug)
  const [zoom, setZoom] = useState<number | null>(null)

  useEffect(() => {
    document.title = caso ? `${caso.titulo} — Alexis Plescia` : 'Proyecto no encontrado — Alexis Plescia'
    window.scrollTo(0, 0)
  }, [caso])

  useEffect(() => {
    if (zoom === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  if (!caso) {
    return (
      <div className="min-h-screen bg-background py-24 px-4 text-center">
        <p className="text-[#e8e8e8]/50 mb-6">No encontré ese proyecto.</p>
        <Link to="/shop" className="btn-primary px-6 py-2.5 text-sm">
          Ver todos los proyectos
        </Link>
      </div>
    )
  }

  const idx = casosOrdenados.findIndex((c) => c.slug === caso.slug)
  const siguiente = casosOrdenados[(idx + 1) % casosOrdenados.length]

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <article className="max-w-4xl mx-auto">
        <nav className="text-xs font-mono text-[#e8e8e8]/35 mb-8 flex flex-wrap gap-2">
          <Link to="/shop" className="hover:text-[#e8e8e8]">
            Proyectos
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${categoriaSlug(caso.categoria)}`} className="hover:text-[#e8e8e8]">
            {caso.categoria}
          </Link>
        </nav>

        <header className="mb-8">
          <p className="label-caps mb-3">{caso.categoria}</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#e8e8e8] leading-tight mb-4">
            {caso.titulo}
          </h1>
          <p className="text-[#e8e8e8]/60 text-lg leading-relaxed mb-5">{caso.resumen}</p>
          {caso.contexto && <p className="text-sm text-gold/70 mb-5">{caso.contexto}</p>}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {caso.stack.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-full text-xs font-mono text-[#e8e8e8]/60 bg-surface border border-border"
              >
                {s}
              </span>
            ))}
          </div>
          {caso.datosFicticios && <AvisoFicticio />}
          {caso.links && caso.links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {caso.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-primary px-5 py-2.5 text-sm">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Captura principal */}
        {caso.capturas[0] && (
          <figure className="mb-12">
            <button
              type="button"
              onClick={() => setZoom(0)}
              className="block w-full rounded-card overflow-hidden border border-border bg-surface cursor-zoom-in"
            >
              <img src={caso.capturas[0].src} alt={caso.capturas[0].epigrafe} className="w-full h-auto" />
            </button>
            <figcaption className="text-xs text-[#e8e8e8]/40 mt-2.5">{caso.capturas[0].epigrafe}</figcaption>
          </figure>
        )}

        <Seccion titulo={caso.problemaTitulo ?? 'Problema'}>
          <p>{caso.problema}</p>
        </Seccion>
        <Seccion titulo={caso.queHiceTitulo ?? 'Qué hice'}>
          <Lista items={caso.queHice} />
        </Seccion>
        <Seccion titulo="Cómo">
          <Lista items={caso.como} />
        </Seccion>
        <Seccion titulo="Resultado">
          <Lista items={caso.resultado} />
        </Seccion>

        {/* Resto de capturas */}
        {caso.capturas.length > 1 && (
          <Seccion titulo="Capturas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {caso.capturas.slice(1).map((c, i) => (
                <figure key={c.src}>
                  <button
                    type="button"
                    onClick={() => setZoom(i + 1)}
                    className="block w-full aspect-[16/10] rounded-lg overflow-hidden border border-border bg-white cursor-zoom-in"
                  >
                    <img src={c.src} alt={c.epigrafe} loading="lazy" className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-300" />
                  </button>
                  <figcaption className="text-xs text-[#e8e8e8]/40 mt-2 leading-relaxed">{c.epigrafe}</figcaption>
                </figure>
              ))}
            </div>
          </Seccion>
        )}

        {caso.archivos.length > 0 && (
          <Seccion titulo="Archivos de ejemplo">
            <ul className="divide-y divide-border border border-border rounded-card overflow-hidden">
              {caso.archivos.map((a) => {
                const ext = a.nombre.split('.').pop() ?? ''
                return (
                  <li key={a.href}>
                    <a
                      href={a.href}
                      download
                      className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-surface transition-colors group"
                    >
                      <span className="text-xl" aria-hidden="true">
                        {EXT_ICON[ext] ?? '📄'}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-mono text-[#e8e8e8] truncate group-hover:text-gold">{a.nombre}</span>
                        <span className="block text-xs text-[#e8e8e8]/40">{a.descripcion}</span>
                      </span>
                      <span className="text-xs text-accent font-medium shrink-0">Descargar ↓</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </Seccion>
        )}

        <Seccion titulo="Qué aprendí">
          <blockquote className="border-l-2 border-accent pl-4 italic text-[#e8e8e8]/70">{caso.aprendizaje}</blockquote>
        </Seccion>

        {caso.datosFicticios && <AvisoFicticio className="mb-12" />}

        <div className="border-t border-border pt-10">
          <p className="label-caps mb-4">Siguiente proyecto</p>
          <div className="max-w-sm">
            <CasoCard caso={siguiente} />
          </div>
        </div>
      </article>

      {/* Visor de capturas */}
      <AnimatePresence>
        {zoom !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setZoom(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              src={caso.capturas[zoom].src}
              alt={caso.capturas[zoom].epigrafe}
              className="max-w-full max-h-[85vh] rounded-lg"
            />
            <p className="text-sm text-white/70 mt-4 max-w-2xl text-center">{caso.capturas[zoom].epigrafe}</p>
            <p className="text-xs text-white/30 mt-2">Tocá en cualquier lado o Esc para cerrar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
