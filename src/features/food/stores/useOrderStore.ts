import { create } from 'zustand'
import type { FoodOrder, FoodOrderStatus } from '@/types'
import { FOOD_ORDER_TRANSITIONS } from '../types'

interface OrderStore {
  orders: FoodOrder[]
  /** Place a new order — sets status to Pending */
  placeOrder: (order: Omit<FoodOrder, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => FoodOrder
  /** Advance an order to its next valid status (Canteen action) */
  updateStatus: (orderId: string, newStatus: FoodOrderStatus) => void
  /** Cancel an order */
  cancelOrder: (orderId: string) => void
}

let _nextId = 1

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [
    {
      id: 'order-101',
      orderedById: 'user-1',
      status: 'Pending',
      items: [
        { menuItemId: 'f1', name: 'Artisan Avocado Toast', unitPrice: 850, quantity: 1 },
        { menuItemId: 'b1', name: 'Cold Brew Coffee', unitPrice: 450, quantity: 1 },
      ],
      totalAmount: 1300,
      deliveryLocation: 'East Wing, Floor 4',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      estimatedReadyAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'order-102',
      orderedById: 'user-2',
      status: 'Pending',
      items: [
        { menuItemId: 'f2', name: 'Spicy Chicken Wrap', unitPrice: 1000, quantity: 2 },
      ],
      totalAmount: 2000,
      deliveryLocation: 'Marketing, Floor 2',
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      estimatedReadyAt: new Date(Date.now() + 1000 * 60 * 18).toISOString(),
    },
    {
      id: 'order-103',
      orderedById: 'user-3',
      status: 'Preparing',
      items: [
        { menuItemId: 'f3', name: 'Quinoa Harvest Bowl', unitPrice: 1200, quantity: 1 },
        { menuItemId: 'b2', name: 'Green Smoothie', unitPrice: 600, quantity: 1 },
      ],
      totalAmount: 1800,
      deliveryLocation: 'Engineering, Floor 3',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      estimatedReadyAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'order-104',
      orderedById: 'user-4',
      status: 'OutForDelivery',
      items: [
        { menuItemId: 'b3', name: 'Iced Latte', unitPrice: 500, quantity: 3 },
      ],
      totalAmount: 1500,
      deliveryLocation: 'Design Studio, Floor 1',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      estimatedReadyAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    }
  ],

  placeOrder(draft) {
    const now = new Date().toISOString()
    const order: FoodOrder = {
      ...draft,
      id: `order-${_nextId++}`,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ orders: [order, ...s.orders] }))
    return order
  },

  updateStatus(orderId, newStatus) {
    set((s) => ({
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o
        const validNext = FOOD_ORDER_TRANSITIONS[o.status]
        if (validNext !== newStatus) {
          console.error(
            `Invalid transition: ${o.status} → ${newStatus}. Expected: ${validNext ?? 'none (terminal state)'}`,
          )
          return o
        }
        return { ...o, status: newStatus, updatedAt: new Date().toISOString() }
      }),
    }))
  },

  cancelOrder(orderId) {
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: 'Cancelled', updatedAt: new Date().toISOString() }
          : o,
      ),
    }))
  },
}))
