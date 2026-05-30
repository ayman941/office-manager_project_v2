import { useState, useEffect } from 'react'
import { useAttendanceStore } from '@/stores/useAttendanceStore'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { useAuth } from '@/features/auth/AuthContext'

export function AttendanceLogPage() {
  const { user } = useAuth()
  const { logs, overrideLog, fetchLogs } = useAttendanceStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
    fetchEmployees()
  }, [fetchLogs, fetchEmployees])
  
  const [overrideData, setOverrideData] = useState({
    checkInTime: '',
    checkOutTime: '',
    reason: ''
  })

  const openOverrideModal = (logId: string) => {
    const log = logs.find(l => l.id === logId)
    if (!log) return
    
    // Format times for datetime-local input
    const formatTime = (isoString?: string) => isoString ? new Date(isoString).toISOString().slice(0, 16) : ''
    
    setSelectedLogId(logId)
    setOverrideData({
      checkInTime: formatTime(log.checkIn),
      checkOutTime: formatTime(log.checkOut),
      reason: ''
    })
  }

  const submitOverride = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLogId || !user) return
    
    overrideLog(
      selectedLogId, 
      {
        checkIn: overrideData.checkInTime ? new Date(overrideData.checkInTime).toISOString() : undefined,
        checkOut: overrideData.checkOutTime ? new Date(overrideData.checkOutTime).toISOString() : undefined,
      },
      overrideData.reason,
      user.id
    )
    
    setSelectedLogId(null)
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-4xl font-extrabold text-on-surface font-headline tracking-tighter">Attendance Log</h1>
        <p className="text-on-surface-variant mt-1">Review and manage employee check-ins and check-outs.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Check In</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Check Out</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Duration</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">No attendance logs found.</td>
                </tr>
              ) : (
                logs.map(log => {
                  const emp = employees.find(u => u.id === log.employeeId)
                  
                  return (
                    <tr key={log.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-4 font-bold text-on-surface">{emp?.name || log.employeeId}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{log.date}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {log.durationMinutes ? `${Math.floor(log.durationMinutes / 60)}h ${log.durationMinutes % 60}m` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${log.source === 'Override' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                          {log.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openOverrideModal(log.id)}
                          className="px-4 py-1.5 bg-surface-container-high hover:bg-primary hover:text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                        >
                          Override
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Modal */}
      {selectedLogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold font-headline mb-4">Override Attendance Log</h3>
            <form onSubmit={submitOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">New Check In</label>
                <input 
                  type="datetime-local" 
                  required
                  value={overrideData.checkInTime}
                  onChange={e => setOverrideData(d => ({ ...d, checkInTime: e.target.value }))}
                  className="w-full bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm p-3"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">New Check Out (Optional)</label>
                <input 
                  type="datetime-local" 
                  value={overrideData.checkOutTime}
                  onChange={e => setOverrideData(d => ({ ...d, checkOutTime: e.target.value }))}
                  className="w-full bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm p-3"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Reason for Override</label>
                <textarea 
                  required
                  value={overrideData.reason}
                  onChange={e => setOverrideData(d => ({ ...d, reason: e.target.value }))}
                  className="w-full bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm p-3 min-h-[100px]"
                  placeholder="Employee forgot to check out..."
                ></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setSelectedLogId(null)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-surface-container rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold text-white bg-error hover:bg-error/90 rounded-xl transition-colors shadow-lg shadow-error/20"
                >
                  Confirm Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
