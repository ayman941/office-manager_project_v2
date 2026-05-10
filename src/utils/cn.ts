import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely, resolving conflicts via tailwind-merge
 * and handling conditional classes via clsx.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-brand-600', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
