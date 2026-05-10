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
        { id: 'f1', name: 'Artisan Avocado Toast', price: 8.50, quantity: 1, type: 'food' },
        { id: 'b1', name: 'Cold Brew Coffee', price: 4.50, quantity: 1, type: 'beverage' }
      ],
      totalPrice: 13.00,
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
        { id: 'f2', name: 'Spicy Chicken Wrap', price: 10.00, quantity: 2, type: 'food' }
      ],
      totalPrice: 20.00,
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
        { id: 'f3', name: 'Quinoa Harvest Bowl', price: 12.00, quantity: 1, type: 'food' },
        { id: 'b2', name: 'Green Smoothie', price: 6.00, quantity: 1, type: 'beverage' }
      ],
      totalPrice: 18.00,
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
        { id: 'b3', name: 'Iced Latte', price: 5.00, quantity: 3, type: 'beverage' }
      ],
      totalPrice: 15.00,
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
