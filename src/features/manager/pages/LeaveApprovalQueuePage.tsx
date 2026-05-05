import { useLeaveStore } from '@/stores/useLeaveStore'
import { SEED_USERS } from '@/features/auth/AuthContext'
import { useAuth } from '@/features/auth/useAuth'

export function LeaveApprovalQueuePage() {
  const { user } = useAuth()
  const { leaves, reviewLeave } = useLeaveStore()
  
  const allEmployees = Object.values(SEED_USERS)
  const directReportIds = allEmployees.filter(emp => emp.managerId === user?.id).map(e => e.id)
  
  // Only show leave requests for direct reports
  const teamLeaves = leaves.filter(l => directReportIds.includes(l.requestedById))
  const pendingLeaves = teamLeaves.filter(l => l.status === 'Pending')

  const todayStr = new Date().toISOString().split('T')[0]

  // Stats computation
  const currentMonth = new Date().getMonth()
  const totalThisMonth = teamLeaves.filter(l => new Date(l.startDate).getMonth() === currentMonth).length
  const approvedCount = teamLeaves.filter(l => l.status === 'Approved').length
  const onLeaveToday = teamLeaves.filter(l => l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr).length

  const handleReview = (leaveId: string, isApproved: boolean) => {
    if (!user) return
    const note = prompt(`Enter a note for this ${isApproved ? 'approval' : 'rejection'} (optional):`)
    reviewLeave(leaveId, isApproved ? 'Approved' : 'Rejected', user.id, note || undefined)
  }

  const getLeaveTypeStyle = (type: string) => {
    switch (type) {
      case 'Annual': return 'bg-primary-container/10 text-primary-container'
      case 'Sick': return 'bg-tertiary-container/10 text-tertiary-container'
      case 'Emergency': return 'bg-error-container text-on-error-container'
      default: return 'bg-secondary-container/10 text-on-secondary-container'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">Leave Requests</h2>
          <nav className="flex text-sm text-slate-500 gap-2 font-medium">
            <span className="text-primary">Dashboard</span>
            <span>/</span>
            <span className="text-on-surface font-semibold">Leave Requests</span>
          </nav>
        </div>
        {pendingLeaves.length > 0 && (
          <div className="flex items-center gap-3 bg-error-container text-on-error-container px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            {pendingLeaves.length} Pending Review
          </div>
        )}
      </div>

      {/* Filters & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between border-none">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total This Month</p>
            <p className="text-2xl font-manrope font-extrabold text-on-surface">{totalThisMonth}</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined">analytics</span>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between border-none">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Approved</p>
            <p className="text-2xl font-manrope font-extrabold text-on-surface">{approvedCount}</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between border-none">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">On Leave Today</p>
            <p className="text-2xl font-manrope font-extrabold text-on-surface">{onLeaveToday}</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-tertiary shadow-sm">
            <span className="material-symbols-outlined">beach_access</span>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between border-none">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Balance Used</p>
            <p className="text-2xl font-manrope font-extrabold text-on-surface">62%</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-container shadow-sm">
            <span className="material-symbols-outlined">donut_large</span>
          </div>
        </div>
      </div>

      {/* Requests Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {pendingLeaves.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center opacity-70 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-[2rem]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <span className="material-symbols-outlined text-slate-400">check_circle</span>
            </div>
            <h3 className="text-lg font-manrope font-bold text-slate-500">All Caught Up</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-[240px]">There are no pending requests to review right now.</p>
          </div>
        ) : (
          pendingLeaves.map(leave => {
            const emp = allEmployees.find(u => u.id === leave.requestedById)
            return (
              <div key={leave.id} className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group border border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    {emp?.avatarUrl ? (
                      <img alt={emp.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" src={emp.avatarUrl} />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-manrope font-black text-2xl shadow-sm">
                        {emp?.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-manrope font-bold text-on-surface">{emp?.name}</h3>
                      <p className="text-sm font-medium text-slate-400">{emp?.role}</p>
                    </div>
                  </div>
                  <span className={`${getLeaveTypeStyle(leave.type)} px-4 py-1.5 rounded-full text-xs font-bold tracking-tight`}>
                    {leave.type} Leave
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-surface-container-low p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">From</p>
                    <p className="font-bold text-on-surface">{formatDate(leave.startDate)}</p>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">To</p>
                    <p className="font-bold text-on-surface">{formatDate(leave.endDate)}</p>
                  </div>
                  <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl">
                    <p className="text-[10px] font-bold opacity-80 uppercase mb-1">Duration</p>
                    <p className="font-bold text-lg">{leave.daysCount} Day{leave.daysCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="mb-10">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Reason for Leave</h4>
                  <p className="text-on-surface/80 leading-relaxed text-sm">
                    {leave.reason}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleReview(leave.id, true)} 
                    className="flex-1 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">done_all</span>
                    Approve Request
                  </button>
                  <button 
                    onClick={() => handleReview(leave.id, false)} 
                    className="px-8 py-4 bg-surface-container-high text-on-surface-variant rounded-2xl font-bold hover:bg-error-container hover:text-on-error-container transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
