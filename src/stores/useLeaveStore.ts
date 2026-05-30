import { create } from 'zustand'
import apiClient from '@/lib/apiClient'
import type { LeaveRequest, LeaveStatus, LeaveType } from '@/types'

interface LeaveBalance {
  id: string
  annualBalance: number
  sickBalance: number
  emergencyBalance: number
  unpaidBalance: number
  employeeId: string
}

interface LeaveStore {
  leaves: LeaveRequest[]
  balances: LeaveBalance[]
  myBalance: LeaveBalance | null
  isLoading: boolean
  fetchLeaves: () => Promise<void>
  fetchBalances: () => Promise<void>
  fetchMyBalance: () => Promise<void>
  submitLeave: (leave: {
    startDate: string
    endDate: string
    type: LeaveType
    reason: string
    requestedById: string
  }) => Promise<LeaveRequest>
  reviewLeave: (leaveId: string, status: LeaveStatus, reviewedById: string, note?: string) => Promise<void>
  auditLeave: (leaveId: string, auditStatus: 'Confirmed' | 'Flagged', hrAuditById: string, note?: string) => Promise<void>
  settings: {
    excludeWeekends: boolean
  }
  updateSettings: (settings: Partial<{ excludeWeekends: boolean }>) => void
}

export function mapBackendLeaveToRequest(req: any): LeaveRequest {
  const statusMap: Record<string, LeaveStatus> = {
    'Pending': 'Pending',
    'ManagerApproved': 'Approved',
    'HRApproved': 'Approved',
    'Rejected': 'Rejected',
    'Cancelled': 'Cancelled',
  }
  
  const start = new Date(req.start_date)
  const end = new Date(req.end_date)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  
  return {
    id: String(req.id),
    requestedById: String(req.employee),
    reviewedById: req.approver ? String(req.approver) : undefined,
    type: req.leave_type,
    status: statusMap[req.status] ?? 'Pending',
    startDate: req.start_date,
    endDate: req.end_date,
    daysCount: diffDays,
    reason: req.reason || '',
    reviewNote: req.review_note || '',
    hrAuditStatus: req.status === 'HRApproved' ? 'Confirmed' : 'Unreviewed',
    createdAt: req.created_at || new Date().toISOString(),
    updatedAt: req.created_at || new Date().toISOString(),
  }
}

export function mapBackendBalance(bal: any): LeaveBalance {
  return {
    id: String(bal.id),
    annualBalance: bal.annual_balance ?? 21,
    sickBalance: bal.sick_balance ?? 7,
    emergencyBalance: bal.emergency_balance ?? 3,
    unpaidBalance: bal.unpaid_balance ?? 0,
    employeeId: String(bal.employee),
  }
}

export const useLeaveStore = create<LeaveStore>((set) => ({
  leaves: [],
  balances: [],
  myBalance: null,
  isLoading: false,
  settings: {
    excludeWeekends: true
  },
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
  },

  async fetchLeaves() {
    set({ isLoading: true })
    try {
      const { data } = await apiClient.get('/leave-requests/')
      const mapped = data.map(mapBackendLeaveToRequest)
      set({ leaves: mapped })
    } catch (err) {
      console.error('Failed to fetch leave requests:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  async fetchBalances() {
    try {
      const { data } = await apiClient.get('/leave-balances/')
      set({ balances: data.map(mapBackendBalance) })
    } catch (err) {
      console.error('Failed to fetch leave balances:', err)
    }
  },

  async fetchMyBalance() {
    try {
      const { data } = await apiClient.get('/leave-balances/')
      if (data && data.length > 0) {
        set({ myBalance: mapBackendBalance(data[0]) })
      } else {
        set({ myBalance: null })
      }
    } catch (err) {
      console.error('Failed to fetch personal leave balance:', err)
    }
  },

  async submitLeave(draft) {
    set({ isLoading: true })
    try {
      const payload = {
        start_date: draft.startDate,
        end_date: draft.endDate,
        leave_type: draft.type,
        reason: draft.reason,
        employee: Number(draft.requestedById)
      }
      const { data } = await apiClient.post('/leave-requests/', payload)
      const newLeave = mapBackendLeaveToRequest(data)
      set((s) => ({ leaves: [newLeave, ...s.leaves] }))
      return newLeave
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message
      throw new Error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  async reviewLeave(leaveId, status, reviewedById, note) {
    set({ isLoading: true })
    try {
      const endpoint = status === 'Approved' ? 'approve' : 'reject'
      const payload = {
        approver: Number(reviewedById),
        review_note: note || ''
      }
      const { data } = await apiClient.post(`/leave-requests/${leaveId}/${endpoint}/`, payload)
      const updatedLeave = mapBackendLeaveToRequest(data)
      set((s) => ({
        leaves: s.leaves.map((l) => (l.id === leaveId ? updatedLeave : l))
      }))
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message
      throw new Error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  async auditLeave(leaveId, auditStatus, hrAuditById, note) {
    // Audit actions are done by HR. If auditStatus is 'Confirmed', it corresponds to HRApproved,
    // which we can map to the approve endpoints or use partial updates.
    // Let's use the partial update/patch endpoint since it modifies the status or audit info.
    set({ isLoading: true })
    try {
      const payload = {
        status: auditStatus === 'Confirmed' ? 'HRApproved' : 'Rejected',
        approver: Number(hrAuditById),
        review_note: note || ''
      }
      const { data } = await apiClient.patch(`/leave-requests/${leaveId}/`, payload)
      const updatedLeave = mapBackendLeaveToRequest(data)
      set((s) => ({
        leaves: s.leaves.map((l) => (l.id === leaveId ? updatedLeave : l))
      }))
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message
      throw new Error(msg)
    } finally {
      set({ isLoading: false })
    }
  }
}))
