import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Proyectos', to: '/shop' },
  { label: 'Sobre mí', to: '/about' },
  { label: 'Contacto', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const { logout } = useAuth()

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="font-display text-2xl tracking-widest hover:text-accent transition-colors"
          >
            <span className="text-accent">ALEXIS</span>
            <span className="text-[#e8e8e8] ml-2">PLESCIA</span>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-body transition-colors ${
                  location.pathname === link.to
                    ? 'text-accent'
                    : 'text-[#e8e8e8]/60 hover:text-[#e8e8e8]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`text-sm font-body transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'text-accent'
                    : 'text-[#e8e8e8]/60 hover:text-[#e8e8e8]'
                }`}
              >
                Panel Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Auth — desktop */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="text-sm font-body text-[#e8e8e8]/70 hover:text-[#e8e8e8] transition-colors"
                >
                  {user?.name.split(' ')[0]}
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-muted hover:text-[#e8e8e8] transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : null}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-[#e8e8e8]/60 hover:text-[#e8e8e8] transition-colors"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-white/5 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`block py-3 text-sm font-body border-b border-white/5 transition-colors ${
                location.pathname === link.to
                  ? 'text-accent'
                  : 'text-[#e8e8e8]/70 hover:text-[#e8e8e8]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={closeMenu}
              className={`block py-3 text-sm font-body border-b border-white/5 transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'text-accent'
                  : 'text-[#e8e8e8]/70 hover:text-[#e8e8e8]'
              }`}
            >
              Panel Admin
            </Link>
          )}

          <div className="pt-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between py-2">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="text-sm font-body text-[#e8e8e8]/70 hover:text-[#e8e8e8] transition-colors"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-muted hover:text-[#e8e8e8] transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  )
}
