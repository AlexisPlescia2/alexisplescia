import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Crear cuenta — Prometeo Tattoo'
  }, [])

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear cuenta'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl tracking-widest">
            <span className="text-accent">PROMETEO</span>
            <span className="text-[#e8e8e8] ml-2">TATTOO</span>
          </Link>
          <h1 className="font-display text-3xl tracking-widest mt-4 mb-1">CREAR CUENTA</h1>
        </div>

        <div className="card-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-800/40 rounded px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-body text-[#e8e8e8]/60 mb-2">Nombre completo</label>
              <input
                type="text"
                className="input-field"
                placeholder="Juan Tatuador"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-body text-[#e8e8e8]/60 mb-2">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-body text-[#e8e8e8]/60 mb-2">Contraseña</label>
              <input
                type="password"
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm font-body text-[#e8e8e8]/40 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-accent hover:text-red-400 transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
