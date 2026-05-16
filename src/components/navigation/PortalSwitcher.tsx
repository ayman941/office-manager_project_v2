import { RadioGroup } from '@headlessui/react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export type Portal = 'manager' | 'employee' | 'hr' | 'canteen'

export interface PortalSwitcherProps {
  activePortal: Portal
}

const PORTALS: { value: Portal; label: string }[] = [
  { value: 'hr',       label: 'HR View' },
  { value: 'manager',  label: 'Manager View' },
  { value: 'canteen',  label: 'Canteen View' },
  { value: 'employee', label: 'Employee View' },
]

export function PortalSwitcher({ activePortal }: PortalSwitcherProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Filter portals based on role
  const visiblePortals = PORTALS.filter((p) => {
    if (p.value === 'employee') return true // Everyone allowed here can see it
    if (user?.role === 'hr_manager' && p.value === 'hr') return true
    if (user?.role === 'manager' && p.value === 'manager') return true
    if (user?.role === 'canteen' && p.value === 'canteen') return true
    return false
  })

  // Only show if more than one option is available
  if (visiblePortals.length <= 1) return null;

  const handleSwitch = (portal: Portal) => {
    if (portal === 'hr') navigate('/hr/dashboard')
    if (portal === 'manager') navigate('/manager/dashboard')
    if (portal === 'canteen') navigate('/canteen/dashboard')
    if (portal === 'employee') navigate('/employee/dashboard')
  }

  return (
    <RadioGroup
      value={activePortal}
      onChange={handleSwitch}
      className="inline-flex rounded-lg bg-surface-container-high p-1 gap-1 items-center shadow-inner"
    >
      <RadioGroup.Label className="sr-only">Switch portal view</RadioGroup.Label>
      {visiblePortals.map((portal) => (
        <RadioGroup.Option
          key={portal.value}
          value={portal.value}
          className={({ checked }) =>
            cn(
              'cursor-pointer rounded-md px-4 py-1.5 text-xs font-bold transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              checked
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'
            )
          }
        >
          {() => <span>{portal.label}</span>}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  )
}
