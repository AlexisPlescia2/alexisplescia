import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Caso, AVISO_DATOS_FICTICIOS } from '../../data/casos'

/** Renderiza **negrita** dentro de un texto plano. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-semibold text-[#e8e8e8]">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

export function AvisoFicticio({ className = '' }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 text-xs text-amber-300/80 bg-amber-400/[0.06] border border-amber-400/20 rounded-lg px-3 py-2 ${className}`}
    >
      <span aria-hidden="true">ⓘ</span>
      <span>{AVISO_DATOS_FICTICIOS}</span>
    </p>
  )
}

export default function CasoCard({ caso }: { caso: Caso }) {
  const portada = caso.capturas[0]
  return (
    <Link
      to={`/proyectos/${caso.slug}`}
      className="group card-dark overflow-hidden flex flex-col h-full hover:border-accent/40"
    >
      {/* Las capturas son claras: un marco oscuro con padding las integra al tema */}
      <div className="aspect-[16/10] overflow-hidden bg-surface border-b border-border relative">
        {portada && (
          <img
            src={portada.src}
            alt={portada.epigrafe}
            loading="lazy"
            className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
          />
        )}
        {caso.datosFicticios && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-sm text-amber-300 border border-amber-400/30">
            Datos ficticios
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <p className="text-xs font-mono text-gold/70 uppercase tracking-wider">{caso.categoria}</p>
        <h3 className="font-semibold text-[#e8e8e8] leading-snug group-hover:text-white">{caso.titulo}</h3>
        <p className="text-sm text-[#e8e8e8]/50 leading-relaxed line-clamp-3">{caso.resumen}</p>
        <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
          {caso.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full text-[11px] font-mono text-[#e8e8e8]/55 bg-surface border border-border"
            >
              {s}
            </span>
          ))}
          {caso.stack.length > 4 && (
            <span className="px-2 py-0.5 text-[11px] font-mono text-[#e8e8e8]/35">+{caso.stack.length - 4}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
