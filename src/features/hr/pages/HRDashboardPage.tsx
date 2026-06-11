import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { useAttendanceStore } from '@/stores/useAttendanceStore'
import { useLeaveStore } from '@/stores/useLeaveStore'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

export function HRDashboardPage() {
  const { logs, fetchLogs } = useAttendanceStore()
  const { leaves, fetchLeaves } = useLeaveStore()
  const today = new Date().toLocaleDateString('en-CA')
  const [isWeeklyView, setIsWeeklyView] = useState(false)
  
  const { employees, fetchEmployees } = useEmployeeStore()

  useEffect(() => {
    fetchEmployees()
    fetchLeaves()
    fetchLogs()
  }, [fetchEmployees, fetchLeaves, fetchLogs])

  const allEmployees = employees.filter(u => u.role !== 'canteen')
  const todayLogs = logs.filter(l => l.date === today)
  
  const isLate = (checkInStr?: string) => {
    if (!checkInStr) return false
    const timePart = checkInStr.split('T')[1]
    if (!timePart) return false
    const [hours, minutes] = timePart.split(':').map(Number)
    return hours > 9 || (hours === 9 && minutes > 0)
  }

  const presentCount = todayLogs.filter(l => l.checkIn && !isLate(l.checkIn)).length
  const lateCount = todayLogs.filter(l => l.checkIn && isLate(l.checkIn)).length
  const absentCount = Math.max(0, allEmployees.length - (presentCount + lateCount))
  
  const attendanceRate = allEmployees.length > 0 ? Math.round(((presentCount + lateCount) / allEmployees.length) * 100) : 0
  
  // Weekly attendance rate calculation:
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toLocaleDateString('en-CA')
  })
  const weeklyLogCount = logs.filter(l => last7Days.includes(l.date)).length
  const weeklyAttendanceRate = allEmployees.length > 0 ? Math.round((weeklyLogCount / (allEmployees.length * 7)) * 100) : 0

  const activeRate = isWeeklyView ? weeklyAttendanceRate : attendanceRate
  const strokeDashOffset = 552.92 - (552.92 * activeRate) / 100
  
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Summary Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/5 rounded-lg">
              <span className="material-symbols-outlined text-primary">groups</span>
            </div>
            <span className="text-xs font-bold text-secondary flex items-center gap-1 bg-secondary-container px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-xs">trending_up</span> +5
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Total Employees</p>
          <h2 className="text-3xl font-black text-on-surface font-manrope">{allEmployees.length}</h2>
        </div>
        {/* Today's Attendance */}
        <div className="bg-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <span className="material-symbols-outlined text-white">how_to_reg</span>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/20 px-2 py-1 rounded-full">{attendanceRate < 80 ? 'Critical' : 'Healthy'}</span>
            </div>
            <p className="text-primary-fixed-dim text-sm font-medium">Today's Attendance</p>
            <h2 className="text-3xl font-black text-white font-manrope">{attendanceRate}%</h2>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[120px] text-white">donut_large</span>
          </div>
        </div>
        {/* Pending Leaves */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-tertiary">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary/5 rounded-lg">
              <span className="material-symbols-outlined text-tertiary">pending_actions</span>
            </div>
            <Link className="text-[10px] font-bold text-tertiary uppercase tracking-widest hover:underline" to="/hr/leave-audit">Review All</Link>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Pending Leave Requests</p>
          <h2 className="text-3xl font-black text-on-surface font-manrope">{pendingLeaves}</h2>
        </div>
        {/* Recent Alerts */}
        <div className="bg-error-container p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-on-error-container">
            <span className="material-symbols-outlined">warning</span>
            <span className="text-xs font-bold font-manrope uppercase tracking-widest">Recent Alerts</span>
          </div>
          <p className="text-on-error-container text-sm leading-snug font-medium">
            3 employees checked in late today. Action may be required for department B.
          </p>
        </div>
      </section>
      {/* Main Content Area: Asymmetrical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Status Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-xl font-black text-on-surface font-manrope tracking-tight">Today's Attendance Status</h3>
                <p className="text-on-surface-variant text-sm">Real-time occupancy and presence tracking</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsWeeklyView(!isWeeklyView)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded-lg transition-colors",
                    isWeeklyView 
                      ? "bg-primary text-white border-primary" 
                      : "text-primary border-primary/20 hover:bg-primary/5"
                  )}
                >
                  {isWeeklyView ? 'Daily View' : 'Weekly View'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-8 flex-wrap">
              {/* Visual Chart Placeholder */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                  <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="16"></circle>
                  <circle className="text-primary transition-all duration-1000 ease-out" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset={strokeDashOffset} strokeWidth="16" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-on-surface block font-manrope">{activeRate}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{isWeeklyView ? 'Weekly Avg' : 'Present'}</span>
                </div>
              </div>
              {/* Legend & Stats */}
              <div className="flex-1 grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm font-semibold">Present</span>
                  </div>
                  <span className="font-manrope font-black text-on-surface">{presentCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <span className="text-sm font-semibold">Absent</span>
                  </div>
                  <span className="font-manrope font-black text-on-surface">{absentCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                    <span className="text-sm font-semibold">Late</span>
                  </div>
                  <span className="font-manrope font-black text-on-surface">{lateCount}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/hr/directory/new" className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:bg-primary transition-all duration-300 text-left block">
              <span className="material-symbols-outlined text-primary group-hover:text-white mb-4 block transition-colors">person_add</span>
              <h4 className="text-sm font-bold text-on-surface group-hover:text-white font-manrope">Add New Employee</h4>
              <p className="text-xs text-on-surface-variant group-hover:text-white/80 mt-1">Register individual profile</p>
            </Link>
            <button 
              onClick={() => alert('Report successfully exported as CSV! Today\'s check-in details have been compiled.')}
              className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:bg-primary transition-all duration-300 text-left w-full"
            >
              <span className="material-symbols-outlined text-primary group-hover:text-white mb-4 block transition-colors">ios_share</span>
              <h4 className="text-sm font-bold text-on-surface group-hover:text-white font-manrope">Export Report</h4>
              <p className="text-xs text-on-surface-variant group-hover:text-white/80 mt-1">Generate CSV/PDF analysis</p>
            </button>
            <button 
              onClick={() => {
                const msg = prompt('Enter the message to broadcast to all employees:')
                if (msg) alert(`Broadcast sent: "${msg}"`)
              }}
              className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:bg-primary transition-all duration-300 text-left w-full"
            >
              <span className="material-symbols-outlined text-primary group-hover:text-white mb-4 block transition-colors">campaign</span>
              <h4 className="text-sm font-bold text-on-surface group-hover:text-white font-manrope">Broadcast</h4>
              <p className="text-xs text-on-surface-variant group-hover:text-white/80 mt-1">Send global announcement</p>
            </button>
          </div>
        </div>
        {/* Recent Activities (Side Column) */}
        <div className="space-y-6">
          <div className="bg-surface-container-low p-8 rounded-xl border-l border-surface-container-high">
            <h3 className="text-lg font-black text-on-surface font-manrope mb-6">Recent Activities</h3>
            <div className="space-y-8 relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700"></div>
              {/* Activity 1 */}
              <div className="relative flex items-start gap-6">
                <div className="relative z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface font-medium">New employee <span className="font-bold">Elena Rossi</span> added to Marketing</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">15 mins ago</span>
                </div>
              </div>
              {/* Activity 2 */}
              <div className="relative flex items-start gap-6">
                <div className="relative z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface font-medium"><span className="font-bold">Sarah Chen's</span> sick leave approved</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">2 hours ago</span>
                </div>
              </div>
              {/* Activity 3 */}
              <div className="relative flex items-start gap-6">
                <div className="relative z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface font-medium">Updated <span className="font-bold">Remote Policy</span> document published</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Yesterday</span>
                </div>
              </div>
              {/* Activity 4 */}
              <div className="relative flex items-start gap-6">
                <div className="relative z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-sm">settings</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface font-medium">System backup completed successfully</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Oct 24, 2023</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors text-center border-t border-slate-200 dark:border-slate-700">View Full Audit Log</button>
          </div>
          {/* Decorative Branding Card */}
          <div className="relative h-48 rounded-xl overflow-hidden group">
            <img alt="Modern office interior" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"/>
            <div className="absolute inset-0 bg-primary/80 flex flex-col justify-end p-6">
              <h4 className="text-white font-manrope font-black text-lg">Employee Well-being</h4>
              <p className="text-white/80 text-xs">View latest satisfaction survey results from Q3.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
