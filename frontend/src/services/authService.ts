import api from './api'

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }
  token: string
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function getMe(): Promise<AuthResponse['user']> {
  const { data } = await api.get('/auth/me')
  return data
}
