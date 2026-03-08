import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import * as authService from '../services/authService'

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()
  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password)
    setAuth(result.user, result.token)
    return result
  }

  const register = async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password)
    setAuth(result.user, result.token)
    return result
  }

  const logout = () => {
    storeLogout()
    navigate('/login')
  }

  return { user, token, isAuthenticated, login, register, logout }
}
