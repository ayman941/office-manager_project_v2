import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useAttendanceStore } from '@/stores/useAttendanceStore'
import { useLeaveStore } from '@/stores/useLeaveStore'
import { useOrderStore } from '@/features/food/stores/useOrderStore'
import { LogOut, LogIn, Utensils, ArrowRight, Calendar, ShieldCheck } from 'lucide-react'

export function EmployeeDashboard() {
  const { user } = useAuth()
  const { logs, checkIn, checkOut } = useAttendanceStore()
  const { leaves } = useLeaveStore()
  const { orders } = useOrderStore()
  
  const today = new Date().toISOString().split('T')[0]
  
  const todayLog = logs.find(l => l.employeeId === user?.id && l.date === today)
  const isCheckedIn = !!todayLog && !todayLog.checkOut

  const userLeaves = leaves.filter(l => l.requestedById === user?.id)
  const leaveBalance = 12 // Mocked annual leave balance
  const sickBalance = 4 // Mocked sick leave balance

  const activeOrder = orders.find(o => o.orderedById === user?.id && o.status !== 'Delivered' && o.status !== 'Cancelled')

  const handleAttendance = () => {
    if (!user) return
    try {
      if (isCheckedIn) {
        checkOut(user.id)
      } else {
        checkIn(user.id, today)
      }
    } catch (e: any) {
      alert(e.message)
    }
  }

  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="pt-8 pb-32 px-6 max-w-7xl mx-auto">
      {/* Hero Personal Greeting */}
      <section className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="mb-2 text-primary font-bold tracking-wider uppercase text-xs font-label">Good Morning, {user?.name.split(' ')[0]}</div>
          <h1 className="text-4xl lg:text-5xl font-headline font-extrabold tracking-tight text-on-surface leading-tight">
            Welcome to your <br/>
            <span className="text-surface-tint">Architectural Flow.</span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-3xl font-headline font-bold text-on-surface">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-sm text-on-surface-variant">
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30"></div>
            {todayLog ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 ${isCheckedIn ? 'bg-secondary-container/30 text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'} rounded-full text-xs font-semibold`}>
                <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-secondary' : 'bg-outline'}`}></span>
                {isCheckedIn ? `Checked in at ${new Date(todayLog.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Checked out'}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-outline"></span>
                Not checked in
              </div>
            )}
          </div>
        </div>

        {/* Check-in Action Card */}
        <div className="lg:col-span-4 bg-primary-container rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-primary/20">
          <div className="relative z-10">
            <h3 className="text-on-primary-container text-xl font-bold font-headline mb-1">Office Presence</h3>
            <p className="text-on-primary-container/70 text-sm">Tap to update your current status</p>
          </div>
          <button 
            onClick={handleAttendance}
            disabled={!!todayLog && !isCheckedIn}
            className={`relative z-10 mt-8 w-full bg-surface-container-lowest py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg ${!!todayLog && !isCheckedIn ? 'text-outline bg-surface-container-high opacity-70 cursor-not-allowed' : 'text-primary hover:bg-white'}`}
          >
            {isCheckedIn ? <LogOut size={24} /> : <LogIn size={24} />}
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-on-primary-container/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Quick Link: Order Food */}
        <Link to="/employee/food" className="md:col-span-1 bg-surface-container-low rounded-3xl p-6 transition-all hover:translate-y-[-4px] group block">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container mb-12 shadow-inner">
            <Utensils size={24} />
          </div>
          <h4 className="text-xl font-headline font-bold mb-2">Order Food</h4>
          <p className="text-on-surface-variant text-sm mb-6">Explore the chef's specials for today's lunch.</p>
          <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
            Go to Buffet <ArrowRight size={16} />
          </div>
        </Link>

        {/* Quick Link: Request Leave */}
        <Link to="/employee/leave" className="md:col-span-1 bg-surface-container-low rounded-3xl p-6 transition-all hover:translate-y-[-4px] group block">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-12 shadow-inner">
            <Calendar size={24} />
          </div>
          <h4 className="text-xl font-headline font-bold mb-2">Request Leave</h4>
          <p className="text-on-surface-variant text-sm mb-6">Planning a getaway? Submit your request here.</p>
          <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
            Book Time <ArrowRight size={16} />
          </div>
        </Link>

        {/* Summary Card: Leave Balance */}
        <div className="md:col-span-1 lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-8">
            <h4 className="text-lg font-headline font-bold">Leave Balance</h4>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">Annual Cycle</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-container-low rounded-2xl">
              <div className="text-3xl font-headline font-extrabold text-primary">{leaveBalance}</div>
              <div className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mt-1">Paid Days Left</div>
            </div>
            <div className="p-4 bg-tertiary-fixed rounded-2xl">
              <div className="text-3xl font-headline font-extrabold text-on-tertiary-fixed">{sickBalance}</div>
              <div className="text-xs text-on-tertiary-fixed-variant uppercase tracking-widest font-bold mt-1">Sick Days</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-outline-variant/10 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant italic">Next holiday: Nov 1st</span>
          </div>
        </div>

        {/* Active Food Order */}
        {activeOrder && (
          <div className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10 relative">
            <div className="flex h-full flex-col md:flex-row">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Active Order</span>
                </div>
                <h4 className="text-xl font-headline font-bold mb-1">{activeOrder.items[0]?.name || 'Your Order'}</h4>
                <p className="text-on-surface-variant text-sm mb-auto">Order #{activeOrder.id.split('-')[1]} • Est. {activeOrder.estimatedReadyAt ? new Date(activeOrder.estimatedReadyAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}</p>
                <div className="mt-6">
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full bg-secondary-container ${activeOrder.status === 'Preparing' ? 'w-2/3' : activeOrder.status === 'OutForDelivery' ? 'w-full' : 'w-1/3'}`}></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{activeOrder.status}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Corporate Policy Snippet */}
        <div className={`md:col-span-1 lg:col-span-2 bg-primary/5 rounded-3xl p-6 border-2 border-dashed border-primary/10 flex items-center gap-6 ${!activeOrder ? 'md:col-span-3 lg:col-span-4' : ''}`}>
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface">Updated Remote Policy</h4>
            <p className="text-sm text-on-surface-variant mt-1">Review the new flexible working guidelines effective from next month.</p>
            <button className="mt-3 text-primary text-xs font-bold underline underline-offset-4">Read Document</button>
          </div>
        </div>
      </div>
    </main>
  )
}
