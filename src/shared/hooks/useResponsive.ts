import { useState, useEffect } from 'react'

// ── Breakpoint definitions ────────────────────────────────────────────────────
// Must match tailwind.config.ts `screens` values exactly.

const BREAKPOINTS = {
  tablet:  640,
  desktop: 1024,
  wide:    1440,
} as const

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'

export interface UseResponsiveReturn {
  /** Current active breakpoint name */
  breakpoint: Breakpoint
  /** width < 640px */
  isMobile: boolean
  /** 640px ≤ width < 1024px */
  isTablet: boolean
  /** 1024px ≤ width < 1440px */
  isDesktop: boolean
  /** width ≥ 1440px */
  isWide: boolean
  /** Raw window.innerWidth in pixels */
  width: number
}

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.wide)    return 'wide'
  if (width >= BREAKPOINTS.desktop) return 'desktop'
  if (width >= BREAKPOINTS.tablet)  return 'tablet'
  return 'mobile'
}

/**
 * useResponsive
 *
 * Returns the current breakpoint and boolean flags based on window width.
 * Uses ResizeObserver (not window.resize) for performance.
 *
 * Usage:
 * ```tsx
 * const { isMobile } = useResponsive()
 * return isMobile ? <BottomTabBar /> : <SideNav />
 * ```
 *
 * ⚠️  Prefer Tailwind responsive classes for pure styling.
 * Reserve this hook for *logic* branches (different components, page sizes, etc.)
 */
export function useResponsive(): UseResponsiveReturn {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(Math.round(entry.contentRect.width))
      }
    })

    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  const breakpoint = getBreakpoint(width)

  return {
    breakpoint,
    isMobile:   breakpoint === 'mobile',
    isTablet:   breakpoint === 'tablet',
    isDesktop:  breakpoint === 'desktop',
    isWide:     breakpoint === 'wide',
    width,
  }
}
