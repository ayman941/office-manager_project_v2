import { create } from 'zustand'
import apiClient from '@/lib/apiClient'
import type { AttendanceLog } from '@/types'

interface AttendanceStore {
  logs: AttendanceLog[]
  todayStatus: AttendanceLog | null
  isLoading: boolean
  fetchLogs: () => Promise<void>
  fetchTodayStatus: () => Promise<void>
  checkIn: (employeeId: string, date: string) => Promise<AttendanceLog>
  checkOut: (employeeId: string) => Promise<void>
  overrideLog: (
    logId: string,
    patch: { checkIn?: string; checkOut?: string },
    reason: string,
    performedById: string
  ) => Promise<void>
  manualAdd: (
    employeeId: string,
    date: string,
    checkIn: string,
    checkOut: string,
    reason: string,
    performedById: string
  ) => Promise<void>
}

function parseBackendTimeToISO(date: string, time: string | null): string | undefined {
  if (!time) return undefined
  // Ensure we append Z to indicate UTC
  return `${date}T${time}Z`
}

function extractTimeFromISO(isoString?: string): string | null {
  if (!isoString) return null
  try {
    return new Date(isoString).toISOString().split('T')[1].slice(0, 8)
  } catch {
    return null
  }
}

export function mapBackendAttendanceToLog(att: any): AttendanceLog {
  const checkIn = parseBackendTimeToISO(att.date, att.check_in_time)
  const checkOut = parseBackendTimeToISO(att.date, att.check_out_time)
  
  let durationMinutes: number | undefined
  if (checkIn && checkOut) {
    durationMinutes = Math.floor((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 60000)
  }

  return {
    id: String(att.id),
    employeeId: String(att.employee),
    date: att.date,
    checkIn,
    checkOut,
    durationMinutes,
    source: att.is_auto_closed ? 'Override' : (att.check_in_time ? 'System' : 'System'),
    createdAt: att.date + 'T00:00:00Z',
    updatedAt: att.date + 'T00:00:00Z',
  }
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  logs: [],
  todayStatus: null,
  isLoading: false,

  async fetchLogs() {
    set({ isLoading: true })
    try {
      const { data } = await apiClient.get('/attendance/')
      const mapped = data.map(mapBackendAttendanceToLog)
      set({ logs: mapped })
    } catch (err) {
      console.error('Failed to fetch attendance logs:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  async fetchTodayStatus() {
    try {
      const { data } = await apiClient.get('/attendance/today_status/')
      set({ todayStatus: data ? mapBackendAttendanceToLog(data) : null })
    } catch {
      set({ todayStatus: null })
    }
  },

  async checkIn(employeeId, date) {
    const payload = {
      date,
      employee: Number(employeeId),
      method: 'WiFi',
      is_auto_closed: false,
      actual_wifi_mac: '00:11:22:33:44:55'
    }
    const { data } = await apiClient.post('/attendance/checkin/', payload)
    const log = mapBackendAttendanceToLog(data)
    set((s) => ({
      todayStatus: log,
      logs: [log, ...s.logs]
    }))
    return log
  },

  async checkOut(employeeId) {
    const date = new Date().toISOString().split('T')[0]
    const payload = {
      date,
      employee: Number(employeeId)
    }
    const { data } = await apiClient.post('/attendance/checkout/', payload)
    const log = mapBackendAttendanceToLog(data)
    set((s) => ({
      todayStatus: log,
      logs: s.logs.map((o) => (o.id === log.id ? log : o))
    }))
  },

  async overrideLog(logId, patch, _reason, _performedById) {
    const payload: any = {}
    if (patch.checkIn) {
      payload.check_in_time = extractTimeFromISO(patch.checkIn)
    }
    if (patch.checkOut) {
      payload.check_out_time = extractTimeFromISO(patch.checkOut)
    }
    // Note: We can also pass details to an override log table if the backend had it,
    // but the backend's Attendance serializer takes standard fields. We will save the patch.
    const { data } = await apiClient.patch(`/attendance/${logId}/`, payload)
    const log = mapBackendAttendanceToLog(data)
    set((s) => ({
      logs: s.logs.map((o) => (o.id === logId ? log : o)),
      todayStatus: s.todayStatus?.id === logId ? log : s.todayStatus
    }))
  },

  async manualAdd(employeeId, date, checkIn, checkOut, _reason, _performedById) {
    const payload = {
      date,
      employee: Number(employeeId),
      check_in_time: extractTimeFromISO(checkIn),
      check_out_time: extractTimeFromISO(checkOut),
      method: 'WiFi',
      is_auto_closed: false,
      actual_wifi_mac: 'Manual Entry'
    }
    const { data } = await apiClient.post('/attendance/', payload)
    const log = mapBackendAttendanceToLog(data)
    set((s) => ({
      logs: [log, ...s.logs]
    }))
  }
}))
