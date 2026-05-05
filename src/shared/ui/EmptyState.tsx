import { cn } from '@/utils/cn'
import { Button, type ButtonProps } from './Button'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: ButtonProps & { label: string }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl',
        'border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="text-gray-300 [&>svg]:h-12 [&>svg]:w-12">{icon}</div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="secondary" size="sm" {...action}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
