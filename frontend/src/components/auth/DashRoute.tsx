import { ReactNode } from 'react'
import { useAuthStore } from '../../store/authStore'
import DashLogin from '../../pages/dash/DashLogin'

interface DashRouteProps {
  children: ReactNode
}

export default function DashRoute({ children }: DashRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <DashLogin />
  }

  return <>{children}</>
}
