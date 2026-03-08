import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const PAGE_NAMES: Record<string, string> = {
  '/about': 'Nosotros',
  '/terms': 'Términos y Condiciones',
  '/privacy': 'Política de Privacidad',
  '/faq': 'Preguntas Frecuentes',
  '/shipping': 'Envíos',
  '/returns': 'Devoluciones',
  '/warranty': 'Garantía',
}

export default function ComingSoon() {
  const { pathname } = useLocation()
  const pageName = PAGE_NAMES[pathname] || 'Esta página'

  useEffect(() => {
    document.title = `${pageName} — Prometeo Tattoo`
  }, [pageName])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">
          Próximamente
        </p>
        <h1 className="font-display text-3xl tracking-widest text-[#e8e8e8] mb-4">
          {pageName.toUpperCase()}
        </h1>
        <p className="font-body text-[#e8e8e8]/40 mb-8">
          Esta sección está en construcción. Pronto vas a poder encontrar toda la información acá.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-secondary">
            Ir al inicio
          </Link>
          <Link to="/contact" className="btn-primary">
            Contactarnos
          </Link>
        </div>
      </div>
    </div>
  )
}
