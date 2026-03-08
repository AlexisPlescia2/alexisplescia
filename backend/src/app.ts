import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { router } from './routes/index'
import { errorHandler } from './middlewares/errorHandler'

const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: origen no permitido — ${origin}`))
      }
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'alexis-portfolio', timestamp: new Date().toISOString() })
})

app.use('/api', router)
app.use(errorHandler)

export default app
