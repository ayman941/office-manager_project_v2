import { cn } from '@/utils/cn'

interface PageHeaderProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between gap-4',
        'border-b border-gray-200 bg-white px-4 py-4 desktop:px-8',
        'sticky top-0 z-30',
        className,
      )}
    >
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-3">{right}</div>}
    </header>
  )
}
