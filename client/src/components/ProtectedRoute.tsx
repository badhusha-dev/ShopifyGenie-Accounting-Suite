import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { UserRole } from '@shopifygenie/shared'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredRoles 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, hasRole, hasAnyRole } = useAuthStore()
  const location = useLocation()

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
