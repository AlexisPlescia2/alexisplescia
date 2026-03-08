export type Role = 'CUSTOMER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  createdAt?: string
}

export interface AuthResponse {
  user: User
  token: string
}
