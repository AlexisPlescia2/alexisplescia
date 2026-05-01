import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useConfigStore } from '../store/configStore'
import api from '../services/api'

const springBase = { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.9 }
const springFast = { type: 'spring' as const, stiffness: 450, damping: 32 }
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

const INFO_ITEMS = (address: string, phone: string, email: string) => [
  { icon: '📍', title: 'Ubicación', value: address },
  { icon: '📞', title: 'Teléfono', value: phone },
  { icon: '📧', title: 'Email', value: email },
  { icon: '💼', title: 'Disponibilidad', value: 'Disponible para proyectos freelance\ny posiciones full-time' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const config = useConfigStore((s) => s.config)

  useEffect(() => {
    document.title = 'Contacto — Alexis Plescia'
  }, [])

  const phone = config['store_phone'] || '+549 1127242060'
  const email = config['store_email'] || 'alexisplescia@gmail.com'
  const address = config['store_address'] || 'Hurlingham, Buenos Aires, Argentina'
  const whatsapp = config['whatsapp_number'] || '5491127242060'
  const linkedin = config['linkedin_url'] || 'https://www.linkedin.com/in/alexisplescia/'
  const github = config['github_url'] || 'https://github.com/AlexisPlescia'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Completá nombre, email y mensaje')
      return
    }
    setSending(true)
    setError('')
    try {
      await api.post('/contact', form)
      setSent(true)
    } catch {
      setError('Error al enviar. Intentá por WhatsApp o email directamente.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springBase}
        >
          <span className="label-caps block mb-3">Hablemos</span>
          <h1 className="section-title">Contacto</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <motion.div
            className="card-dark p-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springBase, delay: 0.1 }}
          >
            <h2 className="font-semibold text-base text-[#e8e8e8] mb-6 tracking-tight">Enviame un mensaje</h2>

            {sent ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springFast}
              >
                <motion.p
                  className="text-3xl mb-3"
                  animate={{ rotate: [0, 10, -8, 6, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  ✅
                </motion.p>
                <p className="text-[#e8e8e8]/60 text-sm">¡Mensaje enviado! Te respondo a la brevedad.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
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
                <input
                  type="text"
                  className="input-field"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  className="input-field"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
                <input
                  type="tel"
                  className="input-field"
                  placeholder="Tu teléfono (opcional)"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
                <textarea
                  className="input-field h-28 resize-none"
                  placeholder="Tu mensaje..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
                <motion.button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full text-sm py-3"
                  whileHover={{ scale: sending ? 1 : 1.02 }}
                  whileTap={{ scale: sending ? 1 : 0.97 }}
                  transition={springFast}
                >
                  {sending ? 'Enviando...' : 'Enviar mensaje'}
                </motion.button>
              </form>
            )}

            <div className="mt-4 space-y-2">
              <motion.a
                href={`https://wa.me/${whatsapp}?text=Hola%20Alexis%2C%20quiero%20contactarte`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-btn"
                style={{ backgroundColor: '#25D366' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springFast}
              >
                WhatsApp
              </motion.a>
              <motion.a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-sm py-2.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springFast}
              >
                LinkedIn
              </motion.a>
              <motion.a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-sm py-2.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springFast}
              >
                GitHub
              </motion.a>
            </div>
          </motion.div>

          {/* Info cards */}
          <motion.div
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {INFO_ITEMS(address, phone, email).map((item) => (
              <motion.div
                key={item.title}
                className="card-dark p-5 flex gap-4"
                variants={fadeUp}
                transition={springBase}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gold text-xs tracking-wide mb-1">{item.title}</h3>
                  <p className="text-sm text-[#e8e8e8]/55 whitespace-pre-line leading-relaxed">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
