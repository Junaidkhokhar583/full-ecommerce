import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'

export function RequireAdmin({ children }: PropsWithChildren) {
  const user = getCurrentUser()
  const location = useLocation()
  const role = (user?.role ?? '').toUpperCase()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role !== 'ADMIN') {
    return (
      <div className="text-sm text-red-300">
        You do not have permission to view this page.
      </div>
    )
  }

  return <>{children}</>
}

