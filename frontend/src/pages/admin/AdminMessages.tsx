import { useEffect, useState } from 'react'
import { adminService, AdminMessage } from '../../services/adminService'

export default function AdminMessages() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Mensajes — Admin'
    adminService.getMessages()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleToggleRead = async (msg: AdminMessage) => {
    const updated = await adminService.markMessageRead(msg.id, !msg.read)
    setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    await adminService.deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (expanded === id) setExpanded(null)
  }

  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-white">MENSAJES</h1>
          {unread > 0 && (
            <p className="text-xs font-mono text-accent mt-1">{unread} sin leer</p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-white/30 font-mono text-sm">
          No hay mensajes todavía
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-[#0d0d10] border rounded-lg transition-colors ${
                msg.read ? 'border-white/5' : 'border-accent/30'
              }`}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id)
                  if (!msg.read) handleToggleRead(msg)
                }}
              >
                {/* Unread dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.read ? 'bg-white/10' : 'bg-accent'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-white">{msg.name}</span>
                    <span className="text-xs text-white/40 font-mono">{msg.email}</span>
                    {msg.phone && (
                      <span className="text-xs text-white/30 font-mono">{msg.phone}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{msg.message}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-white/30 font-mono hidden sm:block">
                    {new Date(msg.createdAt).toLocaleDateString('es-AR', {
                      day: '2-digit', month: '2-digit', year: '2-digit',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white/30 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded body */}
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href={`mailto:${msg.email}`}
                      className="px-4 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded text-xs font-mono hover:bg-accent/20 transition-colors"
                    >
                      Responder por email
                    </a>
                    <button
                      onClick={() => handleToggleRead(msg)}
                      className="px-4 py-1.5 bg-white/5 text-white/50 border border-white/10 rounded text-xs font-mono hover:bg-white/10 transition-colors"
                    >
                      Marcar como {msg.read ? 'no leído' : 'leído'}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="px-4 py-1.5 bg-red-900/10 text-red-400 border border-red-900/20 rounded text-xs font-mono hover:bg-red-900/20 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
