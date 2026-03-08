import app from './app'
import { env } from './config/env'

const PORT = parseInt(env.PORT, 10)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Alexis Plescia Portfolio API corriendo en http://0.0.0.0:${PORT}`)
})
