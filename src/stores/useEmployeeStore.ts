import { create } from 'zustand'
import apiClient from '@/lib/apiClient'
import type { User, UserRole } from '@/types'

interface Department {
  id: number
  name: string
  monthly_buffet_limit: string
}

interface Location {
  id: number
  floor: number
  room_number: string
  desk_description: string
  company_wifi_mac: string
}

interface EmployeeStore {
  employees: User[]
  departments: Department[]
  locations: Location[]
  isLoading: boolean
  error: string | null
  fetchEmployees: () => Promise<void>
  fetchDepartments: () => Promise<void>
  fetchLocations: () => Promise<void>
  createEmployee: (data: Omit<User, 'id' | 'createdAt'> & { password?: string }) => Promise<User>
  updateEmployee: (id: string, patch: Partial<User>) => Promise<User>
}

export function mapRole(djangoRole: string): UserRole {
  const map: Record<string, UserRole> = {
    'Employee':      'employee',
    'Manager':       'manager',
    'HR_Admin':      'hr_manager',
    'Canteen_Staff': 'canteen',
  }
  return map[djangoRole] ?? 'employee'
}

export function mapUserRoleToDjango(role: UserRole): string {
  const map: Record<UserRole, string> = {
    'employee':   'Employee',
    'manager':    'Manager',
    'hr_manager': 'HR_Admin',
    'canteen':    'Canteen_Staff',
  }
  return map[role] ?? 'Employee'
}

export function mapEmployeeToUser(emp: any): User {
  return {
    id:           String(emp.id),
    name:         `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.username,
    email:        emp.email || '',
    role:         mapRole(emp.role),
    departmentId: emp.department ? String(emp.department) : '',
    managerId:    emp.manager ? String(emp.manager) : undefined,
    createdAt:    emp.date_joined ?? new Date().toISOString(),
  }
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  departments: [],
  locations: [],
  isLoading: false,
  error: null,

  async fetchEmployees() {
    set({ isLoading: true, error: null })
    try {
      const { data } = await apiClient.get('/employees/')
      const mapped = data.map(mapEmployeeToUser)
      set({ employees: mapped })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch employees' })
    } finally {
      set({ isLoading: false })
    }
  },

  async fetchDepartments() {
    try {
      const { data } = await apiClient.get('/departments/')
      set({ departments: data })
    } catch (err: any) {
      console.error('Failed to fetch departments:', err)
    }
  },

  async fetchLocations() {
    try {
      const { data } = await apiClient.get('/locations/')
      if (Array.isArray(data) && data.length > 0) {
        set({ locations: data })
      } else {
        throw new Error('Empty locations from backend')
      }
    } catch (err: any) {
      console.error('Failed to fetch locations, using fallback:', err)
      set({
        locations: [
          {
            id: 1,
            floor: 4,
            room_number: "A201",
            desk_description: "Floor 4 - Room A201",
            company_wifi_mac: ""
          }
        ]
      })
    }
  },

  async createEmployee(userData) {
    set({ isLoading: true, error: null })
    try {
      const names = userData.name.split(' ')
      const firstName = names[0] || ''
      const lastName = names.slice(1).join(' ') || ''
      
      const payload = {
        username: userData.email.split('@')[0] || userData.name.replace(/\s+/g, '').toLowerCase(),
        email: userData.email,
        first_name: firstName,
        last_name: lastName,
        role: mapUserRoleToDjango(userData.role),
        department: userData.departmentId ? Number(userData.departmentId) : null,
        manager: userData.managerId ? Number(userData.managerId) : null,
        is_active: true,
        password: userData.password || 'TemporaryPass123!' // Default fallback
      }

      const { data } = await apiClient.post('/employees/', payload)
      const newUser = mapEmployeeToUser(data)
      set((state) => ({ employees: [...state.employees, newUser] }))
      return newUser
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message
      set({ error: msg })
      throw new Error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  async updateEmployee(id, patch) {
    set({ isLoading: true, error: null })
    try {
      const payload: any = {}
      if (patch.name) {
        const names = patch.name.split(' ')
        payload.first_name = names[0] || ''
        payload.last_name = names.slice(1).join(' ') || ''
      }
      if (patch.email) payload.email = patch.email
      if (patch.role) payload.role = mapUserRoleToDjango(patch.role)
      if (patch.departmentId !== undefined) payload.department = patch.departmentId ? Number(patch.departmentId) : null
      if (patch.managerId !== undefined) payload.manager = patch.managerId ? Number(patch.managerId) : null

      const { data } = await apiClient.patch(`/employees/${id}/`, payload)
      const updatedUser = mapEmployeeToUser(data)
      set((state) => ({
        employees: state.employees.map((emp) => (emp.id === id ? updatedUser : emp))
      }))
      return updatedUser
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message
      set({ error: msg })
      throw new Error(msg)
    } finally {
      set({ isLoading: false })
    }
  }
}))
