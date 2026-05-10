import { cn } from '@/utils/cn'

export interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
}

/** Get initials from a full name, e.g. "Jane Doe" → "JD" */
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Derive a deterministic hue from a name string */
function nameToHue(name: string) {
  let hash = 0
  for (const char of name) hash = char.charCodeAt(0) + ((hash << 5) - hash)
  return Math.abs(hash) % 360
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const hue = nameToHue(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeStyles[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white',
        sizeStyles[size],
        className,
      )}
      style={{ backgroundColor: `hsl(${hue} 60% 45%)` }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
