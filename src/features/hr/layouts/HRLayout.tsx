import { Outlet, NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { PortalSwitcher } from '@/components/navigation/PortalSwitcher'
import { useAuth } from '@/features/auth/AuthContext'
import { UserMenu } from '@/shared/ui/UserMenu'
import { LayoutDashboard, IdCard, CalendarOff, BarChart2, Settings, Plus, Search, Bell, HelpCircle, Coffee } from 'lucide-react'

export function HRLayout() {
  const { user } = useAuth()

  return (
    <div className="bg-surface text-on-background min-h-screen font-body selection:bg-secondary-container">
      {/* SideNavBar Anchor */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 z-50 bg-slate-50 dark:bg-slate-950 flex-col p-6 space-y-2 border-r border-slate-200 dark:border-slate-800">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-cyan-900 dark:text-cyan-100 font-manrope">Smart Office</h1>
          <p className="font-manrope uppercase tracking-widest text-[10px] font-semibold text-slate-500">HR Admin</p>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 shadow-sm rounded-lg font-bold transition-all duration-200", isActive ? "bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 translate-x-1" : "text-slate-500 dark:text-slate-400 hover:text-cyan-900 hover:bg-slate-100 dark:hover:bg-slate-800")} to="/hr/dashboard">
            <LayoutDashboard size={20} />
            <span className="font-manrope uppercase tracking-widest text-[10px] font-semibold">Overview</span>
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 shadow-sm rounded-lg font-bold transition-all duration-200", isActive ? "bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 translate-x-1" : "text-slate-500 dark:text-slate-400 hover:text-cyan-900 hover:bg-slate-100 dark:hover:bg-slate-800")} to="/hr/directory">
            <IdCard size={20} />
            <span className="font-manrope uppercase tracking-widest text-[10px] font-semibold">Directory</span>
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 shadow-sm rounded-lg font-bold transition-all duration-200", isActive ? "bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 translate-x-1" : "text-slate-500 dark:text-slate-400 hover:text-cyan-900 hover:bg-slate-100 dark:hover:bg-slate-800")} to="/hr/leave-audit">
            <CalendarOff size={20} />
            <span className="font-manrope uppercase tracking-widest text-[10px] font-semibold">Leave Audit</span>
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 shadow-sm rounded-lg font-bold transition-all duration-200", isActive ? "bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 translate-x-1" : "text-slate-500 dark:text-slate-400 hover:text-cyan-900 hover:bg-slate-100 dark:hover:bg-slate-800")} to="/hr/consumption">
            <Coffee size={20} />
            <span className="font-manrope uppercase tracking-widest text-[10px] font-semibold">Consumption</span>
          </NavLink>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-cyan-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200" href="#">
            <BarChart2 size={20} />
            <span className="font-manrope uppercase tracking-widest text-[10px] font-semibold">Org Stats</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-cyan-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200" href="#">
            <Settings size={20} />
            <span className="font-manrope uppercase tracking-widest text-[10px] font-semibold">Settings</span>
          </a>
        </nav>
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
          <button className="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <Plus size={16} />
            <span className="font-manrope uppercase tracking-widest text-[10px]">Add Employee</span>
          </button>
        </div>
      </aside>

      <main className="md:ml-64 min-h-screen flex flex-col pb-20 md:pb-0">
        {/* TopAppBar Anchor */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm dark:shadow-none flex justify-between items-center w-full px-6 py-3">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search employees, departments, files..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <PortalSwitcher activePortal="hr" />
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                <Bell size={24} />
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
                <HelpCircle size={24} />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-cyan-900 dark:text-cyan-100 font-manrope uppercase tracking-tight">Admin Dashboard</p>
                <p className="text-[10px] text-slate-500">{user?.role === 'hr_manager' ? 'HR Manager' : 'HR Admin'}</p>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        <Outlet />
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_-1px_10px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl border-t border-slate-200">
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center rounded-xl px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300")} to="/hr/dashboard">
          <LayoutDashboard size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Home</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center rounded-xl px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300")} to="/hr/directory">
          <IdCard size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Directory</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center rounded-xl px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100" : "text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300")} to="/hr/leave-audit">
          <CalendarOff size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Audit</span>
        </NavLink>
      </nav>
    </div>
  )
}
