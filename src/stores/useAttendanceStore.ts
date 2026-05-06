import { create } from 'zustand'
import type { AttendanceLog, AttendanceOverride } from '@/types'

interface AttendanceStore {
  logs: AttendanceLog[]
  /** Emulates checking in for the current user */
  checkIn: (employeeId: string, date: string) => AttendanceLog
  /** Emulates checking out for the current user */
  checkOut: (employeeId: string) => void
  /** HR Override */
  overrideLog: (
    logId: string,
    patch: { checkIn?: string; checkOut?: string },
    reason: string,
    performedById: string
  ) => void
  /** Manual Add by HR */
  manualAdd: (
    employeeId: string,
    date: string,
    checkIn: string,
    checkOut: string,
    reason: string,
    performedById: string
  ) => void
}

let _nextId = 1

// Mock initial data to populate the HR dashboard
const MOCK_LOGS: AttendanceLog[] = [
  {
    id: 'log-seed-1',
    employeeId: 'u2',
    date: new Date().toISOString().split('T')[0],
    checkIn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    source: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  logs: MOCK_LOGS,

  checkIn(employeeId, date) {
    const now = new Date().toISOString()
    const existing = get().logs.find(
      (l) => l.employeeId === employeeId && l.date === date && !l.checkOut
    )
    if (existing) {
      throw new Error('409 Conflict: User already checked in without check out.')
    }

    const log: AttendanceLog = {
      id: `log-${_nextId++}`,
      employeeId,
      date,
      checkIn: now,
      source: 'System',
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ logs: [log, ...s.logs] }))
    return log
  },

  checkOut(employeeId) {
    const now = new Date()
    set((s) => ({
      logs: s.logs.map((o) => {
        if (o.employeeId === employeeId && !o.checkOut) {
          const checkInTime = new Date(o.checkIn!)
          const durationMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / 60000)
          return {
            ...o,
            checkOut: now.toISOString(),
            durationMinutes,
            updatedAt: now.toISOString(),
          }
        }
        return o
      }),
    }))
  },

  overrideLog(logId, patch, reason, performedById) {
    const now = new Date().toISOString()
    set((s) => ({
      logs: s.logs.map((o) => {
        if (o.id !== logId) return o
        
        const override: AttendanceOverride = {
          performedById,
          reason,
          originalCheckIn: o.checkIn,
          originalCheckOut: o.checkOut,
          performedAt: now,
        }

        let durationMinutes = o.durationMinutes
        if (patch.checkIn && patch.checkOut) {
           durationMinutes = Math.floor((new Date(patch.checkOut).getTime() - new Date(patch.checkIn).getTime()) / 60000)
        }

        return {
          ...o,
          ...patch,
          durationMinutes: durationMinutes ?? o.durationMinutes,
          source: 'Override',
          override,
          updatedAt: now,
        }
      }),
    }))
  },

  manualAdd(employeeId, date, checkIn, checkOut, reason, performedById) {
    const now = new Date().toISOString()
    const log: AttendanceLog = {
      id: `log-${_nextId++}`,
      employeeId,
      date,
      checkIn,
      checkOut,
      durationMinutes: Math.floor((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 60000),
      source: 'Manual',
      override: {
        performedById,
        reason,
        performedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ logs: [log, ...s.logs] }))
  },
}))
