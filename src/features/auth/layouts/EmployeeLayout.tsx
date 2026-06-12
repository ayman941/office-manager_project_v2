import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { PortalSwitcher } from '@/components/navigation/PortalSwitcher'
import { UserMenu } from '@/shared/ui/UserMenu'
import { Bell, LayoutGrid, Utensils, ReceiptText, Calendar, Zap, Shield, Settings, Clock, Coffee, X } from 'lucide-react'

export function EmployeeLayout() {
  const [showNotifications, setShowNotifications] = useState(false)
  const notifications = [
    { id: 1, text: 'Your Annual Leave request is approved.', time: '2 hours ago' },
    { id: 2, text: 'Buffet order #245 is now preparing.', time: '30 mins ago' },
    { id: 3, text: 'Reminder: Remember to check out before EOD.', time: '1 hour ago' }
  ]

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen selection:bg-secondary-container">
      <main className="flex-1 md:ml-20 pb-20 md:pb-0 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none h-16 flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tighter text-primary font-headline">SmartOffice</span>
          </div>
          <div className="flex items-center gap-4 relative">
            <PortalSwitcher activePortal="employee" />
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200 text-primary relative"
            >
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border border-white"></span>
            </button>
            <UserMenu />

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-12 top-4 w-80 bg-surface shadow-2xl rounded-2xl border border-outline-variant/10 p-4 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20 mb-3">
                  <h4 className="font-bold text-sm text-on-surface">Notifications</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-outline hover:text-on-surface">
                    <X size={16} />
                  </button>
                </div>
                <ul className="space-y-3">
                  {notifications.map(n => (
                    <li key={n.id} className="text-xs p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                      <p className="font-medium text-on-surface">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{n.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </header>

        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] rounded-t-2xl md:hidden">
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600")} to="/employee/dashboard">
          <LayoutGrid size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Home</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600")} to="/employee/attendance">
          <Clock size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Time</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600")} to="/employee/food">
          <Utensils size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Food</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600")} to="/employee/orders">
          <ReceiptText size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Orders</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600")} to="/employee/leave">
          <Calendar size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Leave</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150 hidden sm:flex", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600")} to="/employee/consumption">
          <Coffee size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Costs</span>
        </NavLink>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-surface-container-low z-40 border-r border-outline-variant/10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary mb-12">
          <Zap size={24} />
        </div>
        <div className="flex flex-col gap-8">
          <NavLink to="/employee/dashboard" title="Dashboard" className={({ isActive }) => cn("transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary cursor-pointer")}>
            <LayoutGrid size={24} />
          </NavLink>
          <NavLink to="/employee/attendance" title="Attendance" className={({ isActive }) => cn("transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary cursor-pointer")}>
            <Clock size={24} />
          </NavLink>
          <NavLink to="/employee/food" title="Food Menu" className={({ isActive }) => cn("transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary cursor-pointer")}>
            <Utensils size={24} />
          </NavLink>
          <NavLink to="/employee/orders" title="My Orders" className={({ isActive }) => cn("transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary cursor-pointer")}>
            <ReceiptText size={24} />
          </NavLink>
          <NavLink to="/employee/leave" title="Leave Requests" className={({ isActive }) => cn("transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary cursor-pointer")}>
            <Calendar size={24} />
          </NavLink>
          <NavLink to="/employee/consumption" title="Consumption Costs" className={({ isActive }) => cn("transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary cursor-pointer")}>
            <Coffee size={24} />
          </NavLink>
          <NavLink to="#" title="Security Policy" className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" onClick={(e) => { e.preventDefault(); alert('Security Policy is currently mapped to mock settings operations.') }}>
            <Shield size={24} />
          </NavLink>
        </div>
        <div className="mt-auto">
          <NavLink to="/employee/settings" title="Settings" className={({ isActive }) => cn("transition-colors", isActive ? "text-primary animate-pulse" : "text-on-surface-variant hover:text-primary cursor-pointer")}>
            <Settings size={24} />
          </NavLink>
        </div>
      </aside>
    </div>
  )
}
