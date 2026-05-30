import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import type { UserRole } from '@/types'

export interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * RoleGuard
 *
 * Wraps protected routes. Resolution order:
 * 1. No session        → redirect /login
 * 2. Role not allowed  → render fallback (default: redirect /unauthorized)
 * 3. Allowed           → render children
 */
export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(user.role)) {
    return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
