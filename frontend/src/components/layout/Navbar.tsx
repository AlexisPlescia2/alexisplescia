import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(10, 10, 10, 0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="font-display text-base font-semibold tracking-tight hover:text-accent transition-colors duration-200"
          >
            <span className="text-accent">Alexis</span>
            <span className="text-[#e8e8e8]"> Plescia</span>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                  isActive(link.to)
                    ? 'text-[#e8e8e8] bg-white/[0.08]'
                    : 'text-[#e8e8e8]/50 hover:text-[#e8e8e8] hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && user?.role === 'ADMIN' && (
              <>
                <Link
                  to="/dash"
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                    isActive('/dash')
                      ? 'text-[#e8e8e8] bg-white/[0.08]'
                      : 'text-[#e8e8e8]/50 hover:text-[#e8e8e8] hover:bg-white/[0.05]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                    isActive('/admin')
                      ? 'text-[#e8e8e8] bg-white/[0.08]'
                      : 'text-[#e8e8e8]/50 hover:text-[#e8e8e8] hover:bg-white/[0.05]'
                  }`}
                >
                  Admin
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#e8e8e8]/50">{user?.name.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="text-xs text-muted hover:text-[#e8e8e8] transition-colors px-2 py-1 rounded"
                >
                  Salir
                </button>
              </div>
            ) : null}
          </div>

          {/* Hamburger — mobile */}
          <motion.button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-[#e8e8e8]/50 hover:text-[#e8e8e8] transition-colors rounded-md"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <motion.span
                className="block w-full h-px bg-current origin-center"
                animate={menuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
              <motion.span
                className="block w-full h-px bg-current"
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
              <motion.span
                className="block w-full h-px bg-current origin-center"
                animate={menuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
            className="md:hidden overflow-hidden border-t border-white/[0.06]"
            style={{ background: 'rgba(10, 10, 10, 0.92)', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28, delay: i * 0.04 }}
                >
                  <Link
                    to={link.to}
                    onClick={closeMenu}
                    className={`block py-3 text-sm transition-colors ${
                      isActive(link.to)
                        ? 'text-[#e8e8e8]'
                        : 'text-[#e8e8e8]/50 hover:text-[#e8e8e8]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated && user?.role === 'ADMIN' && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, delay: navLinks.length * 0.04 }}
                  >
                    <Link
                      to="/dash"
                      onClick={closeMenu}
                      className={`block py-3 text-sm transition-colors ${
                        isActive('/dash') ? 'text-[#e8e8e8]' : 'text-[#e8e8e8]/50 hover:text-[#e8e8e8]'
                      }`}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, delay: (navLinks.length + 1) * 0.04 }}
                  >
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className={`block py-3 text-sm transition-colors ${
                        isActive('/admin') ? 'text-[#e8e8e8]' : 'text-[#e8e8e8]/50 hover:text-[#e8e8e8]'
                      }`}
                    >
                      Admin
                    </Link>
                  </motion.div>
                </>
              )}

              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28, delay: (navLinks.length + 1) * 0.04 }}
                  className="pt-3 border-t border-white/[0.06] flex items-center justify-between"
                >
                  <span className="text-sm text-[#e8e8e8]/50">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-muted hover:text-[#e8e8e8] transition-colors"
                  >
                    Salir
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
