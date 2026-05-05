import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

import { UserMenu } from '@/shared/ui/UserMenu'
import { Bell, LayoutGrid, Utensils, ReceiptText, Calendar, Zap, Shield, Settings } from 'lucide-react'

export function EmployeeLayout() {
  const { user } = useAuth()
  
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen selection:bg-secondary-container">
      <main className="flex-1 md:ml-20 pb-20 md:pb-0 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none h-16 flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tighter text-primary font-headline">SmartOffice</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200 text-primary">
              <Bell size={24} />
            </button>
            <UserMenu />
          </div>
        </header>

        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] rounded-t-2xl md:hidden">
        <Link className="flex flex-col items-center justify-center bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl px-3 py-1.5 active:scale-90 transition-transform duration-150" to="/employee/dashboard">
          <LayoutGrid size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5 active:scale-90 transition-transform duration-150 hover:text-cyan-600" to="/employee/food">
          <Utensils size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Food</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5 active:scale-90 transition-transform duration-150 hover:text-cyan-600" to="/employee/food">
          <ReceiptText size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Orders</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5 active:scale-90 transition-transform duration-150 hover:text-cyan-600" to="/employee/leave">
          <Calendar size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Leave</span>
        </Link>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-surface-container-low z-40 border-r border-outline-variant/10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary mb-12">
          <Zap size={24} />
        </div>
        <div className="flex flex-col gap-8">
          <Link to="/employee/dashboard">
            <LayoutGrid className="text-primary" size={24} />
          </Link>
          <Link to="/employee/food">
            <Utensils className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" size={24} />
          </Link>
          <Link to="/employee/food">
            <ReceiptText className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" size={24} />
          </Link>
          <Link to="/employee/leave">
            <Calendar className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" size={24} />
          </Link>
          <Shield className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" size={24} />
        </div>
        <div className="mt-auto">
          <Settings className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" size={24} />
        </div>
      </aside>
    </div>
  )
}
