import { Outlet } from 'react-router-dom'
import { SideNav } from './SideNav'
import { BottomTabBar } from './BottomTabBar'
import { PageHeader } from './PageHeader'
import { useResponsive } from '@/shared/hooks/useResponsive'

interface AppShellProps {
  navItems: { to: string; label: string; icon: React.ReactNode }[]
  title?: string
  headerRight?: React.ReactNode
}

export function AppShell({ navItems, title, headerRight }: AppShellProps) {
  const { isMobile, isTablet } = useResponsive()
  const showBottomBar = isMobile || isTablet

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop side nav */}
      <SideNav items={navItems} />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {title && <PageHeader title={title} right={headerRight} />}

        <main className="flex-1 px-4 py-6 desktop:px-8 pb-24 desktop:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      {showBottomBar && <BottomTabBar items={navItems} />}
    </div>
  )
}
