import { useState } from 'react'
import { useEffect } from 'react'
import { useConfigStore } from '../store/configStore'
import api from '../services/api'

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
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Hablemos</p>
          <h1 className="section-title">Contacto</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card-dark p-8">
            <h2 className="font-display tracking-widest text-xl mb-6 text-[#e8e8e8]">ENVIAME UN MENSAJE</h2>
            {sent ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-[#e8e8e8]/70">¡Mensaje enviado! Te respondo a la brevedad.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-900/20 border border-red-800/40 rounded px-4 py-2 text-sm text-red-400">{error}</div>}
                <input type="text" className="input-field" placeholder="Tu nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input type="email" className="input-field" placeholder="tu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <input type="tel" className="input-field" placeholder="Tu teléfono (opcional)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <textarea className="input-field h-28 resize-none" placeholder="Tu mensaje..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                <button type="submit" className="btn-primary w-full" disabled={sending}>
                  {sending ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
            <div className="mt-4 space-y-2">
              <a href={`https://wa.me/${whatsapp}?text=Hola%20Alexis%2C%20quiero%20contactarte`} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full flex items-center justify-center gap-2" style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: '#fff' }}>
                WhatsApp
              </a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full flex items-center justify-center gap-2">
                LinkedIn
              </a>
              <a href={github} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full flex items-center justify-center gap-2">
                GitHub
              </a>
            </div>
          </div>
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: '📍', title: 'Ubicación', value: address },
              { icon: '📞', title: 'Teléfono', value: phone },
              { icon: '📧', title: 'Email', value: email },
              { icon: '💼', title: 'Disponibilidad', value: 'Disponible para proyectos freelance\ny posiciones full-time' },
            ].map((item) => (
              <div key={item.title} className="card-dark p-5 flex gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-display tracking-widest text-gold text-sm">{item.title.toUpperCase()}</h3>
                  <p className="text-sm font-body text-[#e8e8e8]/60 mt-1 whitespace-pre-line">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
