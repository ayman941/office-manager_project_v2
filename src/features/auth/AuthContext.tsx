import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'

// ── Context types ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

// Seed users — replace with real API calls
export const SEED_USERS: Record<string, User> = {
  'employee@demo.com': {
    id: 'u1', name: 'Alex Johnson', email: 'employee@demo.com',
    role: 'employee', departmentId: 'd1', managerId: 'u2', createdAt: '2025-01-15T00:00:00Z',
  },
  'manager@demo.com': {
    id: 'u2', name: 'Sarah Manager', email: 'manager@demo.com',
    role: 'manager', departmentId: 'd1', managerId: 'u4', createdAt: '2024-06-10T00:00:00Z',
  },
  'canteen@demo.com': {
    id: 'u3', name: 'Canteen Staff', email: 'canteen@demo.com',
    role: 'canteen', departmentId: 'd2', createdAt: '2025-03-01T00:00:00Z',
  },
  'hr@demo.com': {
    id: 'u4', name: 'HR Manager', email: 'hr@demo.com',
    role: 'hr_manager', departmentId: 'd3', createdAt: '2024-01-01T00:00:00Z',
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600)) // simulate network
      const found = SEED_USERS[email.toLowerCase()]
      if (!found) throw new Error('Invalid credentials')
      setUser(found)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => setUser(null), [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook export ───────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
