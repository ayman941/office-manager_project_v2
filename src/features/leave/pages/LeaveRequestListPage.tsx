import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { useLeaveStore } from '@/stores/useLeaveStore'
import { Plus, Filter, Umbrella, Stethoscope, AlertTriangle, CalendarOff, MoreVertical, Calendar } from 'lucide-react'

export function LeaveRequestListPage() {
  const { user } = useAuth()
  const { leaves } = useLeaveStore()
  
  const userLeaves = leaves.filter(l => l.requestedById === user?.id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-success/10 text-success uppercase tracking-wide">Approved</span>
      case 'Rejected':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-critical/10 text-critical uppercase tracking-wide">Rejected</span>
      default:
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-outline-variant/30 text-on-surface-variant uppercase tracking-wide">Pending</span>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Annual': return <Umbrella size={24} />
      case 'Sick': return <Stethoscope size={24} />
      case 'Emergency': return <AlertTriangle size={24} />
      default: return <CalendarOff size={24} />
    }
  }

  const getTypeColors = (type: string) => {
    switch (type) {
      case 'Annual': return 'bg-primary/10 text-primary'
      case 'Sick': return 'bg-secondary/20 text-primary'
      case 'Emergency': return 'bg-critical/10 text-critical'
      default: return 'bg-outline-variant/20 text-on-surface-variant'
    }
  }

  return (
    <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full pb-32 md:pb-8">
      {/* Page Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Leave Overview</h1>
          <p className="text-on-surface-variant max-w-xl font-medium">Manage your time off, view remaining balances, and track your pending requests in one place.</p>
        </div>
        <Link to="/employee/leave/new" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-card active:scale-95 transition-all">
          <Plus size={20} /> Request Time Off
        </Link>
      </header>

      {/* Leave Balance Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Annual Leave */}
        <div className="bg-surface p-6 rounded-2xl shadow-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
            <Umbrella size={80} />
          </div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Annual Leave</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-on-surface font-headline">14</span>
            <span className="text-on-surface-variant font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Available until Dec 31</p>
          <div className="mt-4 h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[70%]"></div>
          </div>
        </div>

        {/* Sick Leave */}
        <div className="bg-surface p-6 rounded-2xl shadow-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
            <Stethoscope size={80} />
          </div>
          <p className="text-sm font-bold uppercase tracking-wider text-secondary mb-4 text-primary">Sick Leave</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-on-surface font-headline">08</span>
            <span className="text-on-surface-variant font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Full pay eligibility</p>
          <div className="mt-4 h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-[40%]"></div>
          </div>
        </div>

        {/* Emergency Leave */}
        <div className="bg-surface p-6 rounded-2xl shadow-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-critical">
            <AlertTriangle size={80} />
          </div>
          <p className="text-sm font-bold uppercase tracking-wider text-critical mb-4">Emergency</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-on-surface font-headline">03</span>
            <span className="text-on-surface-variant font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Personal & Family</p>
          <div className="mt-4 h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-critical w-[10%]"></div>
          </div>
        </div>

        {/* Unpaid Leave */}
        <div className="bg-background p-6 rounded-2xl shadow-inner border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Unpaid Leave</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-slate-400 font-headline">00</span>
            <span className="text-slate-400 font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Taken this period</p>
        </div>
      </section>

      {/* Request List Container */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-headline text-on-surface">Recent Requests</h3>
          <div className="flex gap-2">
            <button className="bg-surface p-2 rounded-lg text-primary hover:bg-background transition-colors shadow-sm">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {userLeaves.length === 0 ? (
          <div className="bg-surface p-12 rounded-2xl shadow-card text-center">
            <Calendar className="mx-auto text-outline-variant mb-4" size={48} />
            <p className="text-on-surface font-bold">No leave requests yet.</p>
            <p className="text-on-surface-variant text-sm mt-1">When you request time off, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userLeaves.map(leave => (
              <div key={leave.id} className="bg-surface p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-card duration-300 border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColors(leave.type)}`}>
                    {getTypeIcon(leave.type)}
                  </div>
                  <div>
                    <h4 className="font-bold font-headline text-lg text-on-surface leading-tight">{leave.type} Leave</h4>
                    <p className="text-sm text-on-surface-variant font-medium">{leave.startDate} - {leave.endDate} ({leave.daysCount} Days)</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                    <p className="text-sm font-semibold text-on-surface">{leave.type}</p>
                  </div>
                  {getStatusBadge(leave.status)}
                  <button className="text-slate-400 hover:text-primary transition-colors p-2">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {userLeaves.length > 0 && (
          <div className="mt-8 text-center">
            <button className="text-primary font-bold hover:underline py-2 px-4 transition-all">View All History</button>
          </div>
        )}
      </section>
    </main>
  )
}
