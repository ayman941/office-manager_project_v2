import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useAuth } from '@/features/auth/useAuth'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

interface SideNavProps {
  items: NavItem[]
}

export function SideNav({ items }: SideNavProps) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  return (
    <aside className="hidden desktop:flex flex-col w-60 min-h-screen border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-gray-100">
        <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">OM</span>
        </div>
        <span className="font-semibold text-gray-900 text-sm">Office Manager</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <span className={cn('h-5 w-5', isActive ? 'text-brand-600' : 'text-gray-400')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div className="border-t border-gray-100 px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Sign out"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
