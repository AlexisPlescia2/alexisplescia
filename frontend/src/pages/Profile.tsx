import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user, isAuthenticated } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Perfil — Alexis Plescia'
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Datos del usuario */}
        <div className="card-dark p-8 flex items-center justify-between">
          <div>
            <h1 className="section-title text-2xl mb-1">{user?.name}</h1>
            <p className="text-muted text-sm">{user?.email}</p>
            {user?.role === 'ADMIN' && (
              <span className="text-xs text-accent font-semibold mt-1 inline-block">ADMIN</span>
            )}
          </div>
          <button className="btn-ghost text-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        {/* Links de navegación */}
        <div className="card-dark p-8 text-center">
          <p className="text-muted mb-4">Bienvenido al panel de administración</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/shop" className="btn-primary">
              Ver proyectos
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="btn-secondary">
                Panel Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
