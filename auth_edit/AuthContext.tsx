import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import axios from 'axios'
import apiClient from '@/lib/apiClient'
import type { User } from '@/types'
export const SEED_USERS: Record<string, never> = {}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User['role']>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapRole(djangoRole: string): User['role'] {
  const map: Record<string, User['role']> = {
    'Employee':      'employee',
    'Manager':       'manager',
    'HR_Admin':      'hr_manager',
    'Canteen_Staff': 'canteen',
  }
  return map[djangoRole] ?? 'employee'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    setIsLoading(true)
    apiClient.get('/employees/me/')
      .then(({ data }) => {
        setUser({
          id:           String(data.id),
          name:         data.full_name,
          email:        data.email,
          role:         mapRole(data.role),
          departmentId: String(data.department ?? ''),
          managerId:    data.manager ? String(data.manager) : undefined,
          createdAt:    data.date_joined ?? new Date().toISOString(),
        })
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data: tokens } = await axios.post(
        'https://smart-office-backend-production.up.railway.app/api/token/',
        { username: email, password }
      )
      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)

     
      const { data } = await apiClient.get('/employees/me/', {
        headers: {
          Authorization: `Bearer ${tokens.access}`
        }
      })
      
      setUser({
        id:           String(data.id),
        name:         data.full_name,
        email:        data.email,
        role:         mapRole(data.role),
        departmentId: String(data.department ?? ''),
        managerId:    data.manager ? String(data.manager) : undefined,
        createdAt:    data.date_joined ?? new Date().toISOString(),
      })
      return mapRole(data.role) as User['role']
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
