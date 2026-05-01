import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Agregar JWT de authStore a cada request
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('alexis-auth')
    if (raw) {
      const { state } = JSON.parse(raw)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
  } catch {
    // ignorar errores de parse
  }
  return config
})

// Manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    const message =
      error.response?.data?.message || error.message || 'Error de conexión'
    return Promise.reject(new Error(message))
  },
)

export default api
