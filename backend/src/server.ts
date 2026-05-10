import http from 'http'
import app from './app'
import { env } from './config/env'

const PORT = parseInt(env.PORT, 10)

// Llama al propio /api/keepalive cada 10 minutos para evitar que Render duerma
// el servicio y que Supabase pause el proyecto por inactividad en plan gratuito.
// cron-job.org externo apuntando a /api/keepalive actúa como respaldo adicional.
const KEEPALIVE_INTERVAL_MS = 10 * 60 * 1000

function startKeepaliveScheduler(port: number): void {
  if (!env.KEEPALIVE_TOKEN) {
    console.warn('[keepalive] KEEPALIVE_TOKEN no definido — scheduler deshabilitado')
    return
  }

  setInterval(() => {
    const path = `/api/keepalive?token=${encodeURIComponent(env.KEEPALIVE_TOKEN)}`
    const req = http.get({ hostname: '127.0.0.1', port, path }, (res) => {
      console.log(`[keepalive] ping → ${res.statusCode}`)
    })
    req.on('error', (err) => console.error('[keepalive] error en ping:', err.message))
  }, KEEPALIVE_INTERVAL_MS)

  console.log(`[keepalive] scheduler iniciado — ping cada ${KEEPALIVE_INTERVAL_MS / 60000} min`)
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Alexis Plescia Portfolio API corriendo en http://0.0.0.0:${PORT}`)
  startKeepaliveScheduler(PORT)
})
