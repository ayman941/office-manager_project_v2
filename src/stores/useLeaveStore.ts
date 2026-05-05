import { create } from 'zustand'
import type { LeaveRequest, LeaveStatus } from '@/types'

interface LeaveStore {
  leaves: LeaveRequest[]
  settings: { excludeWeekends: boolean }
  submitLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'hrAuditStatus' | 'createdAt' | 'updatedAt'>) => LeaveRequest
  updateSettings: (settings: Partial<{ excludeWeekends: boolean }>) => void
  reviewLeave: (leaveId: string, status: LeaveStatus, reviewedById: string, note?: string) => void
  auditLeave: (leaveId: string, auditStatus: 'Confirmed' | 'Flagged', hrAuditById: string, note?: string) => void
}

let _nextId = 1

// Mock leaves to populate tables
const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-seed-1',
    requestedById: 'u1', // employee
    reviewedById: 'u2',  // manager
    type: 'Annual',
    status: 'Approved',
    startDate: '2026-05-10',
    endDate: '2026-05-14',
    daysCount: 5,
    reason: 'Summer vacation',
    reviewNote: 'Enjoy your trip!',
    hrAuditStatus: 'Unreviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'leave-seed-2',
    requestedById: 'u1',
    type: 'Sick',
    status: 'Pending',
    startDate: '2026-06-01',
    endDate: '2026-06-02',
    daysCount: 2,
    reason: 'Medical appointment',
    hrAuditStatus: 'Unreviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export const useLeaveStore = create<LeaveStore>((set) => ({
  leaves: MOCK_LEAVES,
  settings: { excludeWeekends: true },

  updateSettings(settings) {
    set((s) => ({ settings: { ...s.settings, ...settings } }))
  },

  submitLeave(draft) {
    const now = new Date().toISOString()
    const leave: LeaveRequest = {
      ...draft,
      id: `leave-${_nextId++}`,
      status: 'Pending',
      hrAuditStatus: 'Unreviewed',
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ leaves: [leave, ...s.leaves] }))
    return leave
  },

  reviewLeave(leaveId, status, reviewedById, note) {
    set((s) => ({
      leaves: s.leaves.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status,
              reviewedById,
              reviewNote: note,
              updatedAt: new Date().toISOString(),
            }
          : l
      ),
    }))
  },

  auditLeave(leaveId, auditStatus, hrAuditById, note) {
    set((s) => ({
      leaves: s.leaves.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              hrAuditStatus: auditStatus,
              hrAuditById,
              hrAuditNote: note,
              hrAuditedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : l
      ),
    }))
  },
}))
