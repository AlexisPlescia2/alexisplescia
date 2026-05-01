import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Alexis Plescia'
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-[12rem] leading-none text-surface select-none">
          404
        </h1>
        <div className="-mt-8">
          <h2 className="font-display text-3xl tracking-widest text-[#e8e8e8] mb-3">
            PÁGINA NO ENCONTRADA
          </h2>
          <p className="text-[#e8e8e8]/40 font-body mb-8">
            La página que buscás no existe o fue movida.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/" className="btn-primary">
              Volver al inicio
            </Link>
            <Link to="/shop" className="btn-ghost border border-border">
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
