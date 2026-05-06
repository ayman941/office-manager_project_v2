import { useAuth } from '@/features/auth/AuthContext'
import { useAttendanceStore } from '@/stores/useAttendanceStore'

export function MyAttendancePage() {
  const { user } = useAuth()
  const { logs } = useAttendanceStore()
  
  const myLogs = logs.filter(l => l.employeeId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (minutes?: number) => {
    if (minutes === undefined) return '-'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  return (
    <main className="pt-8 pb-32 px-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">My Attendance</h1>
        <p className="text-on-surface-variant font-body">Review your daily check-in logs and total hours worked.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Check In</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Check Out</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {myLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">history</span>
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                myLogs.map(log => (
                  <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-on-surface">
                      {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {formatTime(log.checkIn)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${log.checkOut ? 'bg-secondary' : 'bg-outline-variant'}`}></span>
                        {formatTime(log.checkOut) || 'Active'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-on-surface font-mono">
                      {formatDuration(log.durationMinutes)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
