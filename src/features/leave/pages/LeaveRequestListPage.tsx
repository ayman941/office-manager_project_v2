import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useLeaveStore } from '@/stores/useLeaveStore'
import { Plus, Umbrella, Stethoscope, AlertTriangle, CalendarOff, MoreVertical, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/apiClient'

export function LeaveRequestListPage() {
  const { user } = useAuth()
  const { leaves, fetchLeaves, myBalance, fetchMyBalance } = useLeaveStore()
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'>('All')
  const [sortBy, setSortBy] = useState<'date' | 'days'>('date')
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
  
  useEffect(() => {
    fetchLeaves()
    fetchMyBalance()
  }, [fetchLeaves, fetchMyBalance])

  const userLeaves = leaves.filter(l => l.requestedById === user?.id)

  const filteredLeaves = userLeaves
    .filter(l => statusFilter === 'All' || l.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      } else {
        return b.daysCount - a.daysCount
      }
    })

  const handleCancelRequest = async (leaveId: string) => {
    if (!confirm('Are you sure you want to cancel this leave request?')) return
    try {
      await apiClient.patch(`/leave-requests/${leaveId}/`, { status: 'Cancelled' })
      alert('Request cancelled successfully.')
      fetchLeaves()
    } catch (err: any) {
      alert('Failed to cancel request: ' + err.message)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#005c4d] text-white uppercase tracking-wide">Approved</span>
      case 'Rejected':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#8a1a08] text-white uppercase tracking-wide">Rejected</span>
      case 'Cancelled':
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#475569] text-white uppercase tracking-wide">Cancelled</span>
      default:
        return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#1e293b] text-white uppercase tracking-wide">Pending</span>
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
            <span className="text-5xl font-extrabold text-on-surface font-headline">
              {String(myBalance?.annualBalance ?? 21).padStart(2, '0')}
            </span>
            <span className="text-on-surface-variant font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Available until Dec 31</p>
          <div className="mt-4 h-1.5 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${myBalance ? Math.min(100, Math.max(0, (myBalance.annualBalance / 21) * 100)) : 70}%` }}
            ></div>
          </div>
        </div>

        {/* Sick Leave */}
        <div className="bg-surface p-6 rounded-2xl shadow-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
            <Stethoscope size={80} />
          </div>
          <p className="text-sm font-bold uppercase tracking-wider text-secondary mb-4 text-primary">Sick Leave</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-on-surface font-headline">
              {String(myBalance?.sickBalance ?? 7).padStart(2, '0')}
            </span>
            <span className="text-on-surface-variant font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Full pay eligibility</p>
          <div className="mt-4 h-1.5 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all duration-500" 
              style={{ width: `${myBalance ? Math.min(100, Math.max(0, (myBalance.sickBalance / 7) * 100)) : 40}%` }}
            ></div>
          </div>
        </div>

        {/* Emergency Leave */}
        <div className="bg-surface p-6 rounded-2xl shadow-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-critical">
            <AlertTriangle size={80} />
          </div>
          <p className="text-sm font-bold uppercase tracking-wider text-critical mb-4">Emergency</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-on-surface font-headline">
              {String(myBalance?.emergencyBalance ?? 3).padStart(2, '0')}
            </span>
            <span className="text-on-surface-variant font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Personal & Family</p>
          <div className="mt-4 h-1.5 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-critical transition-all duration-500" 
              style={{ width: `${myBalance ? Math.min(100, Math.max(0, (myBalance.emergencyBalance / 3) * 100)) : 10}%` }}
            ></div>
          </div>
        </div>

        {/* Unpaid Leave */}
        <div className="bg-background p-6 rounded-2xl shadow-inner border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Unpaid Leave</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-slate-400 font-headline">
              {String(myBalance?.unpaidBalance ?? 0).padStart(2, '0')}
            </span>
            <span className="text-slate-400 font-semibold">days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Taken this period</p>
        </div>
      </section>

      {/* Request List Container */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-2xl font-bold font-headline text-on-surface">Recent Requests</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status:</span>
              <select 
                className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer text-primary p-0 py-0.5"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sort:</span>
              <select 
                className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer text-primary p-0 py-0.5"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
              >
                <option value="date">Newest Date</option>
                <option value="days">Duration Days</option>
              </select>
            </div>
          </div>
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="bg-surface p-12 rounded-2xl shadow-card text-center border border-outline-variant/10">
            <Calendar className="mx-auto text-outline-variant mb-4" size={48} />
            <p className="text-on-surface font-bold">No leave requests match the criteria.</p>
            <p className="text-on-surface-variant text-sm mt-1">Adjust filters or submit a new request.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeaves.map(leave => (
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
                
                <div className="flex items-center justify-between md:justify-end gap-6 relative">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                    <p className="text-sm font-semibold text-on-surface">{leave.type}</p>
                  </div>
                  {getStatusBadge(leave.status)}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdownId(activeDropdownId === leave.id ? null : leave.id)}
                      className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {activeDropdownId === leave.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-outline-variant/10 z-50 p-2 space-y-1 text-left">
                        <button 
                          onClick={() => { alert(`Reason for leave request:\n"${leave.reason || 'No reason provided'}"`); setActiveDropdownId(null); }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-on-surface hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          View Reason
                        </button>
                        {leave.status === 'Pending' && (
                          <button 
                            onClick={() => { handleCancelRequest(leave.id); setActiveDropdownId(null); }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-error hover:bg-error-container/20 rounded-lg transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    )}
                  </div>
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
