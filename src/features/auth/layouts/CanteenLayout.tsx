import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useAuth } from '@/features/auth/AuthContext'
import { useOrderStore } from '@/features/food/stores/useOrderStore'
import { PortalSwitcher } from '@/components/navigation/PortalSwitcher'
import { UserMenu } from '@/shared/ui/UserMenu'
import { LayoutDashboard, UtensilsCrossed, ReceiptText, Archive, Settings, Search, Bell, LayoutGrid, Utensils, Plus, X } from 'lucide-react'

export function CanteenLayout() {
  const { user } = useAuth()
  const { orders } = useOrderStore()
  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'OutForDelivery').length
  const [showNotifications, setShowNotifications] = useState(false)
  const notifications = [
    { id: 1, text: 'Low stock alert: Rice bags are below 10%', time: '1 hour ago' },
    { id: 2, text: 'New bulk breakfast order received.', time: '2 hours ago' },
    { id: 3, text: 'Menu schedule update complete.', time: '5 hours ago' }
  ]

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface font-body text-on-surface">
      {/* Navigation Drawer (SideNav for Desktop) */}
      <aside className="hidden md:flex h-screen w-72 flex-col gap-2 p-6 bg-slate-50 border-r-0 rounded-r-3xl shadow-2xl z-40 fixed left-0 top-0 overflow-y-auto">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold text-cyan-900 tracking-tighter">SmartOffice</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Canteen Operations</p>
        </div>
        
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high">
            {user?.avatarUrl ? (
              <img alt={user.name} className="w-full h-full object-cover" src={user.avatarUrl} />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">{user?.name.charAt(0)}</div>
            )}
          </div>
          <div>
            <p className="font-headline text-sm font-bold text-cyan-900">{user?.name}</p>
            <p className="text-xs text-slate-500">Operations Manager</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-all", isActive ? "bg-cyan-100 text-cyan-900 font-bold" : "text-slate-600 hover:bg-slate-200/50 hover:translate-x-1")} to="/canteen/dashboard">
            <LayoutDashboard size={20} />
            <span className="font-manrope text-sm">Dashboard</span>
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-all", isActive ? "bg-cyan-100 text-cyan-900 font-bold" : "text-slate-600 hover:bg-slate-200/50 hover:translate-x-1")} to="/canteen/menu">
            <UtensilsCrossed size={20} />
            <span className="font-manrope text-sm">Meal Planner</span>
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-all", isActive ? "bg-cyan-100 text-cyan-900 font-bold" : "text-slate-600 hover:bg-slate-200/50 hover:translate-x-1")} to="/canteen/orders">
            <ReceiptText size={20} />
            <span className="font-manrope text-sm">All Orders</span>
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-all", isActive ? "bg-cyan-100 text-cyan-900 font-bold" : "text-slate-600 hover:bg-slate-200/50 hover:translate-x-1")} to="/canteen/inventory">
            <Archive size={20} />
            <span className="font-manrope text-sm">Inventory</span>
          </NavLink>
          <NavLink className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-all", isActive ? "bg-cyan-100 text-cyan-900 font-bold" : "text-slate-600 hover:bg-slate-200/50 hover:translate-x-1")} to="/canteen/settings">
            <Settings size={20} />
            <span className="font-manrope text-sm">Settings</span>
          </NavLink>
        </nav>

        <div className="mt-auto p-4 bg-primary-container rounded-2xl text-on-primary-container">
          <p className="text-xs font-bold opacity-80 uppercase tracking-tighter mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></div>
            <span className="text-sm font-semibold tracking-tight">Kitchen Live</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen pb-20 md:pb-8 relative flex flex-col">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 h-16 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-manrope font-bold text-xl tracking-tight text-cyan-900">Orders Dashboard</h2>
            <div className="hidden lg:flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{activeOrdersCount} Active Orders</span>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            <PortalSwitcher activePortal="canteen" />
            <button className="p-2 text-slate-500 hover:bg-slate-100/50 rounded-full transition-colors active:scale-95 duration-200">
              <Search size={24} />
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:bg-slate-100/50 rounded-full transition-colors active:scale-95 duration-200 relative"
            >
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
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

        <Outlet />
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/90 backdrop-blur-xl rounded-t-2xl z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 text-cyan-800 rounded-xl" : "text-slate-400 hover:text-cyan-600")} to="/canteen/dashboard">
          <LayoutGrid size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Home</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 text-cyan-800 rounded-xl" : "text-slate-400 hover:text-cyan-600")} to="/canteen/menu">
          <Utensils size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Food</span>
        </NavLink>
        <NavLink className={({ isActive }) => cn("flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150", isActive ? "bg-cyan-50 text-cyan-800 rounded-xl" : "text-slate-400 hover:text-cyan-600")} to="/canteen/orders">
          <ReceiptText size={24} />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">Orders</span>
        </NavLink>
      </nav>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center z-50 active:scale-90 transition-transform">
        <Plus size={24} />
      </button>
    </div>
  )
}
