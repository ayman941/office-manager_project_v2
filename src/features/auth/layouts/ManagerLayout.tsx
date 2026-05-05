import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { PortalSwitcher } from '@/components/navigation/PortalSwitcher'
import { useAuth } from '@/features/auth/AuthContext'
import { UserMenu } from '@/shared/ui/UserMenu'
import { Bell, LayoutDashboard, ClipboardCheck, Users, Settings } from 'lucide-react'

export function ManagerLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const activePortal = pathname.startsWith('/employee') ? 'employee' : 'manager'
  const { user } = useAuth()

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
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 transition-all rounded-lg font-manrope text-sm font-medium" to="/manager/dashboard">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100 font-bold rounded-lg font-manrope text-sm hover:translate-x-1 transition-all" to="/manager/leave">
            <ClipboardCheck size={20} /> Leave Approvals
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 transition-all rounded-lg font-manrope text-sm font-medium" to="/manager/team">
            <Users size={20} /> Team
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 transition-all rounded-lg font-manrope text-sm font-medium" to="#">
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-72 pb-20 md:pb-0 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <span className="text-xl font-black tracking-tighter text-cyan-800 dark:text-cyan-400 font-headline">SmartOffice</span>
          </div>
          <div className="flex items-center gap-4">
            <PortalSwitcher 
              activePortal={activePortal} 
              onSwitch={(portal) => navigate(portal === 'employee' ? '/employee/dashboard' : '/manager/dashboard')}
            />
            <button className="p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200">
              <Bell className="text-cyan-900 dark:text-cyan-100" size={24} />
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_-1px_10px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl">
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5 hover:text-cyan-600 dark:hover:text-cyan-300 active:scale-90 transition-transform duration-150" to="/manager/dashboard">
          <LayoutDashboard size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl px-3 py-1.5 active:scale-90 transition-transform duration-150" to="/manager/leave">
          <ClipboardCheck size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Approvals</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5 hover:text-cyan-600 dark:hover:text-cyan-300 active:scale-90 transition-transform duration-150" to="/manager/team">
          <Users size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider">Team</span>
        </Link>
      </nav>
    </div>
  )
}
