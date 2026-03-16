import 'dotenv/config'

const isProd = process.env.NODE_ENV === 'production'

function required(key: string): string {
  const val = process.env[key]
  if (!val) {
    console.warn(`[env] ADVERTENCIA: ${key} no definido`)
  }
  return val ?? ''
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback
}

export const env = {
  PORT: optional('PORT', '4000'),
  NODE_ENV: optional('NODE_ENV', 'development'),
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  FRONTEND_URL: optional('FRONTEND_URL', 'http://localhost:5173'),
  BACKEND_URL: optional('BACKEND_URL', 'http://localhost:4000'),
  ALLOWED_ORIGINS: optional('ALLOWED_ORIGINS', 'http://localhost:5173'),
}

// Validar en runtime pero sin crashear el proceso al importar
const missing = Object.entries({
  DATABASE_URL: env.DATABASE_URL,
  JWT_SECRET: env.JWT_SECRET,
}).filter(([, v]) => !v).map(([k]) => k)

if (missing.length > 0) {
  console.error(`[env] Variables críticas faltantes: ${missing.join(', ')}`)
  if (isProd) {
    // Log el error pero no crashear — Railway healthcheck necesita que el proceso arranque
    console.error('[env] La app puede no funcionar correctamente sin estas variables')
  }
}
