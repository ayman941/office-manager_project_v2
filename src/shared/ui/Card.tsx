import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
  /** Adds a hover lift effect — useful for clickable cards */
  hoverable?: boolean
  /** Remove default padding for full-bleed content */
  noPadding?: boolean
}

export function Card({
  header,
  footer,
  hoverable = false,
  noPadding = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-card',
        hoverable && 'cursor-pointer transition-shadow duration-200 hover:shadow-card-hover',
        className,
      )}
      {...props}
    >
      {header && (
        <div className="border-b border-gray-100 px-5 py-3.5 text-sm font-semibold text-gray-700">
          {header}
        </div>
      )}

      <div className={cn(!noPadding && 'p-5')}>{children}</div>

      {footer && (
        <div className="border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  )
}
