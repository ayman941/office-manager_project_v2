import { useState, useEffect } from 'react'

/**
 * useDebounce
 *
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of inactivity. Useful for search inputs and filter fields.
 *
 * @example
 * const debouncedQuery = useDebounce(query, 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
