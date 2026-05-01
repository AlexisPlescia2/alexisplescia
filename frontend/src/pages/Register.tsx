import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const springBase = { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.9 }
const springFast = { type: 'spring' as const, stiffness: 450, damping: 32 }

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Crear cuenta — Alexis Plescia'
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
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springBase}
      >
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-base font-semibold tracking-tight">
            <span className="text-accent">Alexis</span>
            <span className="text-[#e8e8e8]"> Plescia</span>
          </Link>
          <h1 className="text-xl font-semibold text-[#e8e8e8] mt-4 tracking-tight">Crear cuenta</h1>
        </div>

        <div className="card-dark p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                className="bg-red-900/20 border border-red-800/30 rounded-md px-4 py-2.5 text-sm text-red-400"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springFast}
                style={{ borderRadius: '8px' }}
              >
                {error}
              </motion.div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#e8e8e8]/60">Nombre completo</label>
              <input type="text" className="input-field" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#e8e8e8]/60">Email</label>
              <input type="email" className="input-field" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#e8e8e8]/60">Contraseña</label>
              <input type="password" className="input-field" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <motion.button
              type="submit"
              className="btn-primary w-full mt-2 text-sm py-3"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              transition={springFast}
            >
              {loading ? 'Creando...' : 'Crear cuenta'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#e8e8e8]/35 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-accent hover:text-blue-400 transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
