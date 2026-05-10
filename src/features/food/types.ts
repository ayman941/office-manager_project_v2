import type { FoodOrderStatus } from '@/types'

// Re-export for feature-local usage
export type { FoodOrder, FoodOrderItem, FoodOrderStatus } from '@/types'

/** Valid forward-only status transitions */
export const FOOD_ORDER_TRANSITIONS: Record<FoodOrderStatus, FoodOrderStatus | null> = {
  Pending:        'Preparing',
  Preparing:      'OutForDelivery',
  OutForDelivery: 'Delivered',
  Delivered:      null,
  Cancelled:      null,
}
