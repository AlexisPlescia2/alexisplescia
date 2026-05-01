import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { login } from '../../services/authService'

const springBase = { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.9 }
const springFast = { type: 'spring' as const, stiffness: 450, damping: 32 }

export default function DashLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Completá email y contraseña')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      if (res.user.role !== 'ADMIN') {
        setError('Acceso denegado')
        return
      }
      setAuth(res.user, res.token)
    } catch {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,64,175,0.08) 0%, #0a0a0a 70%)' }}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springBase}
      >
        {/* Logo / title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springBase, delay: 0.08 }}
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4"
            style={{ borderRadius: '12px' }}>
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-[#e8e8e8] tracking-tight">Panel privado</h1>
          <p className="text-sm text-[#e8e8e8]/35 mt-1">Solo para el dueño del sitio</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="card-dark p-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springBase, delay: 0.14 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                className="bg-red-900/20 border border-red-800/30 rounded-md px-4 py-2.5 text-sm text-red-400 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springFast}
                style={{ borderRadius: '8px' }}
              >
                {error}
              </motion.div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#e8e8e8]/60">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#e8e8e8]/60">Contraseña</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-sm py-3 mt-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              transition={springFast}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verificando...
                </span>
              ) : 'Ingresar'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
