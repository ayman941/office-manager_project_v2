import { cn } from '@/utils/cn'
import type { FoodOrderStatus, LeaveStatus } from '@/types'

// ── Status colour map ─────────────────────────────────────────────────────────
// Maps any status value → Tailwind colour classes

type AnyStatus = FoodOrderStatus | LeaveStatus | string

const STATUS_STYLES: Record<string, string> = {
  // Food order statuses
  Pending:        'bg-amber-100  text-amber-800  ring-amber-200',
  Preparing:      'bg-blue-100   text-blue-800   ring-blue-200',
  OutForDelivery: 'bg-purple-100 text-purple-800 ring-purple-200',
  Delivered:      'bg-green-100  text-green-800  ring-green-200',
  // Leave statuses
  Approved:       'bg-green-100  text-green-800  ring-green-200',
  Rejected:       'bg-red-100    text-red-800    ring-red-200',
  Cancelled:      'bg-gray-100   text-gray-600   ring-gray-200',
}

const DEFAULT_STYLE = 'bg-gray-100 text-gray-600 ring-gray-200'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BadgeProps {
  status: AnyStatus
  /** Optional override label (defaults to status string) */
  label?: string
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Badge({ status, label, className }: BadgeProps) {
  const styles = STATUS_STYLES[status] ?? DEFAULT_STYLE

  // Human-readable label: "OutForDelivery" → "Out for Delivery"
  let displayLabel =
    label ?? status.replace(/([A-Z])/g, ' $1').trim()
  if (status === 'OutForDelivery') {
    displayLabel = 'Out for Delivery'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
        'text-xs font-medium ring-1 ring-inset',
        styles,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {displayLabel}
    </span>
  )
}
