import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface TabItem {
  to: string
  label: string
  icon: React.ReactNode
}

interface BottomTabBarProps {
  items: TabItem[]
}

export function BottomTabBar({ items }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex desktop:hidden border-t border-gray-200 bg-white/90 backdrop-blur-md safe-area-inset-bottom">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
              isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className={cn('h-6 w-6 transition-transform', isActive && 'scale-110')}>
                {item.icon}
              </span>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
