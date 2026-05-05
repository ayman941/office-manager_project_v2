import { Link } from 'react-router-dom'
import { useAuth, SEED_USERS } from '@/features/auth/AuthContext'
import { useLeaveStore } from '@/stores/useLeaveStore'
import { useAttendanceStore } from '@/stores/useAttendanceStore'

export function ManagerDashboardPage() {
  const { user } = useAuth()
  const { leaves, reviewLeave } = useLeaveStore()
  const { logs } = useAttendanceStore()

  const allEmployees = Object.values(SEED_USERS)
  const directReports = allEmployees.filter(emp => emp.managerId === user?.id)
  const directReportIds = directReports.map(e => e.id)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Team Attendance
  const teamLogsToday = logs.filter(l => l.date === todayStr && directReportIds.includes(l.employeeId))
  const presentCount = teamLogsToday.length
  const totalTeamSize = directReportIds.length
  const absentCount = Math.max(0, totalTeamSize - presentCount)
  const attendanceRate = totalTeamSize > 0 ? Math.round((presentCount / totalTeamSize) * 100) : 100
  
  // A simple late calculation: if check-in is after 09:15 local time
  const lateCount = teamLogsToday.filter(l => {
    const checkInDate = new Date(l.checkIn)
    return checkInDate.getHours() > 9 || (checkInDate.getHours() === 9 && checkInDate.getMinutes() > 15)
  }).length

  // Leave Requests
  const teamLeaves = leaves.filter(l => directReportIds.includes(l.requestedById))
  const pendingLeaves = teamLeaves.filter(l => l.status === 'Pending')

  const handleReview = (leaveId: string, isApproved: boolean) => {
    if (!user) return
    const note = prompt(`Enter a note for this ${isApproved ? 'approval' : 'rejection'} (optional):`)
    reviewLeave(leaveId, isApproved ? 'Approved' : 'Rejected', user.id, note || undefined)
  }

  // Out Today
  const outTodayLeaves = teamLeaves.filter(l => l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr)
  const outTodayEmployees = outTodayLeaves.map(l => allEmployees.find(e => e.id === l.requestedById)).filter(Boolean)

  // Upcoming Leaves
  const upcomingLeaves = teamLeaves.filter(l => l.status === 'Approved' && l.startDate > todayStr).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0, 3)

  // Recent Activity (Mocked mixed with some real data if we wanted, but we'll use a static array based on the blueprint for UI completeness)
  const recentActivities = [
    { id: 1, type: 'checkin', text: 'James Wilson checked in', subtext: 'Main Lobby Entrance • 08:42 AM', color: 'bg-secondary' },
    { id: 2, type: 'upload', text: 'Linda Wu uploaded Leave Certificate', subtext: 'Remote Access Portal • 09:15 AM', color: 'bg-primary' },
    { id: 3, type: 'event', text: 'Team "Marketing" Daily Stand-up started', subtext: 'Conference Room B • 10:00 AM', color: 'bg-tertiary' }
  ]

  const currentMonthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)) // Monday
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  const weekLabel = `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${endOfWeek.toLocaleDateString('en-US', { day: '2-digit' })}`

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      {/* Hero Summary (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Featured Team Greeting */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-[2rem] min-h-[16rem] shadow-sm group">
          <img 
            alt="Manager Dashboard Hero" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 flex flex-col justify-center px-8 md:px-12 text-white">
            <h2 className="text-3xl md:text-4xl font-black font-headline tracking-tight mb-2">Good morning, {user?.name.split(' ')[0]}.</h2>
            <p className="max-w-md text-primary-fixed opacity-90 leading-relaxed font-medium">
              Your team has {attendanceRate}% attendance today. You have {pendingLeaves.length} pending leave requests that need your review.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/manager/leave" className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-surface-bright active:scale-95 transition-all">
                Review Requests
              </Link>
              <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/30 active:scale-95 transition-all">
                Team Pulse
              </button>
            </div>
          </div>
        </div>

        {/* Team Attendance Breakdown */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border-t-4 border-primary">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline font-bold text-lg text-on-surface">Team Attendance</h3>
            <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary-fixed/30 rounded-full uppercase tracking-widest">Today</span>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <span className="text-sm font-semibold text-slate-600">Present</span>
              </div>
              <span className="text-2xl font-black font-headline text-on-surface">{presentCount.toString().padStart(2, '0')}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                  <span className="material-symbols-outlined text-2xl">cancel</span>
                </div>
                <span className="text-sm font-semibold text-slate-600">Absent</span>
              </div>
              <span className="text-2xl font-black font-headline text-on-surface">{absentCount.toString().padStart(2, '0')}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-2xl">schedule</span>
                </div>
                <span className="text-sm font-semibold text-slate-600">Late Arrivals</span>
              </div>
              <span className="text-2xl font-black font-headline text-on-surface">{lateCount.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Activity & Pending */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Pending Leave Requests Card */}
          <div className="bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-extrabold text-xl text-on-surface flex items-center gap-2">
                Pending Leave Requests
                {pendingLeaves.length > 0 && <span className="bg-error text-white text-xs px-2 py-0.5 rounded-full">{pendingLeaves.length}</span>}
              </h3>
              <Link className="text-sm font-bold text-primary hover:underline" to="/manager/leave">View all requests</Link>
            </div>
            
            <div className="space-y-4">
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">task_alt</span>
                  <p className="font-medium">All caught up! No pending requests.</p>
                </div>
              ) : (
                pendingLeaves.slice(0, 3).map((leave) => {
                  const emp = allEmployees.find(e => e.id === leave.requestedById)
                  return (
                    <div key={leave.id} className="bg-surface-container-lowest p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-outline-variant/5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        {emp?.avatarUrl ? (
                          <img alt={emp.name} className="w-12 h-12 rounded-full object-cover shadow-sm" src={emp.avatarUrl} />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">{emp?.name.charAt(0)}</div>
                        )}
                        <div>
                          <h4 className="font-bold text-on-surface text-sm">{emp?.name}</h4>
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">{leave.type} Leave • {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({leave.daysCount} day{leave.daysCount !== 1 ? 's' : ''})</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleReview(leave.id, false)} className="w-10 h-10 flex items-center justify-center text-error hover:bg-error-container rounded-xl transition-colors">
                          <span className="material-symbols-outlined">close</span>
                        </button>
                        <button onClick={() => handleReview(leave.id, true)} className="w-10 h-10 flex items-center justify-center text-secondary hover:bg-secondary-container rounded-xl transition-colors">
                          <span className="material-symbols-outlined">check</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Recent Team Activity */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10">
            <h3 className="font-headline font-extrabold text-xl text-on-surface mb-8">Recent Team Activity</h3>
            <div className="relative border-l-2 border-surface-container-high ml-4 space-y-10">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="relative pl-8">
                  <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full ${activity.color}/20 border-4 border-white shadow-sm flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 ${activity.color} rounded-full`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{activity.text}</p>
                    <p className="text-xs text-on-surface-variant mt-1.5 font-medium">{activity.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calendar & Upcoming */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Leave Calendar Widget */}
          <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm overflow-hidden border border-outline-variant/10">
            <div className="bg-primary p-6 text-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold font-headline">{currentMonthName}</h3>
                <div className="flex gap-2">
                  <button className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                  <button className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                </div>
              </div>
              <p className="text-xs text-primary-fixed opacity-90 font-medium">{weekLabel}</p>
            </div>
            
            <div className="p-6">
              {/* Dummy week view for aesthetics matching blueprint */}
              <div className="grid grid-cols-7 gap-1 text-center mb-6">
                {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="text-[10px] font-black text-slate-400 uppercase">{d}</span>)}
                {[9,10,11,12,13,14,15].map((d, i) => (
                  <span key={i} className={`text-xs font-bold py-2 mt-2 ${d === 11 ? 'bg-primary/10 text-primary rounded-full' : (d >= 14 ? 'text-slate-400' : 'text-on-surface')}`}>
                    {d.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Out Today</h4>
                {outTodayEmployees.length === 0 ? (
                  <p className="text-sm font-medium text-on-surface-variant">Everyone is present today.</p>
                ) : (
                  <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                    {outTodayEmployees.slice(0, 5).map((emp, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm ring-2 ring-transparent hover:ring-primary z-10 hover:z-50 transition-all cursor-help" title={`${emp?.name} - On Leave`}>
                        {emp?.avatarUrl ? (
                          <img alt={emp.name} className="w-full h-full object-cover" src={emp.avatarUrl} />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">{emp?.name.charAt(0)}</div>
                        )}
                      </div>
                    ))}
                    {outTodayEmployees.length > 5 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant z-0">
                        +{outTodayEmployees.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Team Leave */}
          <div className="bg-surface-container-high rounded-[2rem] p-8">
            <h3 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2 text-lg">
              <span className="material-symbols-outlined text-primary">event_upcoming</span>
              Upcoming Leave
            </h3>
            
            <div className="space-y-4">
              {upcomingLeaves.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-4">No upcoming leaves scheduled.</p>
              ) : (
                upcomingLeaves.map(leave => {
                  const emp = allEmployees.find(e => e.id === leave.requestedById)
                  const startD = new Date(leave.startDate)
                  return (
                    <div key={leave.id} className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 shadow-sm">
                      <div className="flex-shrink-0 w-12 text-center bg-surface-container-low rounded-lg py-1.5">
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase">{startD.toLocaleDateString('en-US', { month: 'short' })}</p>
                        <p className="text-xl font-black font-headline text-on-surface leading-none">{startD.getDate()}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{emp?.name}</p>
                        <p className="text-[11px] text-on-surface-variant truncate font-medium mt-0.5">{leave.type} Leave ({leave.daysCount}d)</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
