import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { LogOut, User as UserIcon, Settings } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { Fragment } from 'react'

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-primary font-bold">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-surface shadow-card ring-1 ring-black/5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-outline-variant/20">
            <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
            <p className="text-xs font-medium text-on-surface-variant truncate">{user.email}</p>
          </div>
          
          <div className="p-1">
            <MenuItem>
              {({ focus }) => (
                <button
                  className={`${
                    focus ? 'bg-surface-container-low text-primary' : 'text-on-surface'
                  } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors`}
                >
                  <UserIcon className="mr-3 h-4 w-4 text-outline" aria-hidden="true" />
                  My Profile
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  className={`${
                    focus ? 'bg-surface-container-low text-primary' : 'text-on-surface'
                  } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors`}
                >
                  <Settings className="mr-3 h-4 w-4 text-outline" aria-hidden="true" />
                  Settings
                </button>
              )}
            </MenuItem>
          </div>
          
          <div className="p-1 border-t border-outline-variant/20">
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={logout}
                  className={`${
                    focus ? 'bg-critical/10 text-critical' : 'text-critical'
                  } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-bold transition-colors`}
                >
                  <LogOut className="mr-3 h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
