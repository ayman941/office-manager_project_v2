import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { PortalSwitcher } from '@/components/navigation/PortalSwitcher'
import { useAuth } from '@/features/auth/AuthContext'
import { UserMenu } from '@/shared/ui/UserMenu'
import { Bell, LayoutDashboard, ClipboardCheck, Users, Settings, X } from 'lucide-react'

export function ManagerLayout() {
  const { pathname } = useLocation()
  const activePortal = pathname.startsWith('/employee') ? 'employee' : 'manager'
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const notifications = [
    { id: 1, text: 'New leave request from Alex Johnson.', time: '1 hour ago' },
    { id: 2, text: 'Weekly team attendance report is ready.', time: '3 hours ago' },
    { id: 3, text: 'Canteen food audit for Sector 4 completed.', time: '1 day ago' }
  ]

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-secondary-container flex">
      {/* NavigationDrawer (Desktop) */}
      <aside className="hidden md:flex flex-col gap-2 p-6 h-screen w-72 rounded-r-3xl bg-slate-50 dark:bg-slate-950 shadow-2xl fixed left-0 top-0 z-40 overflow-y-auto">
        <div className="mb-8 flex flex-col items-start px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden">
              {user?.avatarUrl ? (
                <img alt={user.name} className="w-full h-full object-cover" src={user.avatarUrl} />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-lg">{user?.name.charAt(0)}</div>
              )}
            </div>
            <div>
              <h3 className="font-headline font-bold text-cyan-900 dark:text-cyan-50 leading-tight">{user?.name}</h3>
              <p className="text-xs text-slate-500">Manager</p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold bg-slate-200/50 px-2 py-0.5 rounded">HQ-Sector 4</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg font-manrope text-sm transition-all", isActive ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100 font-bold hover:translate-x-1" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 font-medium")} to="/manager/dashboard">
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg font-manrope text-sm transition-all", isActive ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100 font-bold hover:translate-x-1" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 font-medium")} to="/manager/leave">
            <ClipboardCheck size={20} /> Leave Approvals
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg font-manrope text-sm transition-all", isActive ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100 font-bold hover:translate-x-1" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 font-medium")} to="/manager/team">
            <Users size={20} /> Team
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg font-manrope text-sm transition-all", isActive ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100 font-bold hover:translate-x-1" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 font-medium")} to="/manager/settings">
            <Settings size={20} /> Settings
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 md:ml-72 pb-20 md:pb-0 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <span className="text-xl font-black tracking-tighter text-cyan-800 dark:text-cyan-400 font-headline">SmartOffice</span>
          </div>
          <div className="flex items-center gap-4 relative">
            <PortalSwitcher activePortal={activePortal as any} />
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200 text-cyan-900 dark:text-cyan-100 relative"
            >
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border border-white"></span>
            </button>
            <UserMenu />

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-12 top-4 w-80 bg-surface shadow-2xl rounded-2xl border border-outline-variant/10 p-4 z-50 animate-in fade-in slide-in-from-top-5 duration-200 text-left">
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

        {/* Main Content Area */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_-1px_10px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl">
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300")} to="/manager/dashboard">
          <LayoutDashboard size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Home</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300")} to="/manager/leave">
          <ClipboardCheck size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Approvals</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300")} to="/manager/team">
          <Users size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Team</span>
        </NavLink>
      </nav>
    </div>
  )
}
