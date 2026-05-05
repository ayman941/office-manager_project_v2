import { cn } from '@/utils/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full',
        'border-2 border-current border-t-transparent text-brand-600',
        className,
      )}
    />
  )
}
