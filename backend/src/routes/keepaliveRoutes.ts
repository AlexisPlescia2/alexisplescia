import { Router } from 'express'
import { prisma } from '../config/prisma'
import { env } from '../config/env'

const router = Router()

// Mantiene activos el servidor Render (que duerme tras 15 min de inactividad en plan
// gratuito) y el proyecto Supabase (que pausa la DB por inactividad).
// Requiere el header x-keepalive-token o el query param ?token para evitar abuso.
// El scheduler interno en server.ts llama a esta ruta; cron-job.org actúa de respaldo.
router.get('/', async (req, res, next) => {
  try {
    const provided =
      (req.headers['x-keepalive-token'] as string | undefined) ??
      (req.query.token as string | undefined)

    if (!env.KEEPALIVE_TOKEN || provided !== env.KEEPALIVE_TOKEN) {
      res.status(401).json({ error: true, message: 'Unauthorized' })
      return
    }

    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (err) {
    next(err)
  }
})

export default router
