import { RadioGroup } from '@headlessui/react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/features/auth/AuthContext'

export type Portal = 'manager' | 'employee' | 'hr'

export interface PortalSwitcherProps {
  activePortal: Portal
  onSwitch: (portal: Portal) => void
}

const PORTALS: { value: Portal; label: string }[] = [
  { value: 'hr',       label: 'HR View' },
  { value: 'manager',  label: 'Manager View' },
  { value: 'employee', label: 'Employee View' },
]

export function PortalSwitcher({ activePortal, onSwitch }: PortalSwitcherProps) {
  const { user } = useAuth()

  // Filter portals based on role
  const visiblePortals = PORTALS.filter((p) => {
    if (user?.role === 'hr_manager') return true
    if (user?.role === 'manager') return p.value !== 'hr'
    return p.value === 'employee' // default fallback
  })

  // Only show if more than one option is available
  if (visiblePortals.length <= 1) return null;

  return (
    <RadioGroup
      value={activePortal}
      onChange={onSwitch}
      className="inline-flex rounded-lg bg-gray-100 p-0.5 gap-0.5"
    >
      <RadioGroup.Label className="sr-only">Switch portal view</RadioGroup.Label>
      {visiblePortals.map((portal) => (
        <RadioGroup.Option
          key={portal.value}
          value={portal.value}
          className={({ checked }) =>
            cn(
              'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
              checked
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )
          }
        >
          {({ checked }) => (
            <span>{portal.label}</span>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  )
}
