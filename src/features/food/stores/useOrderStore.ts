import { create } from 'zustand'
import apiClient from '@/lib/apiClient'
import type { FoodOrder, FoodOrderStatus } from '@/types'
import { useMenuStore } from '@/features/canteen/stores/useMenuStore'

interface OrderStore {
  orders: FoodOrder[]
  isLoading: boolean
  fetchOrders: () => Promise<void>
  placeOrder: (order: {
    orderedById: string
    items: { menuItemId: string; name: string; quantity: number; unitPrice: number }[]
    totalAmount: number
    deliveryLocation: string
    notes?: string
  }) => Promise<FoodOrder>
  updateStatus: (orderId: string, newStatus: FoodOrderStatus) => Promise<void>
  cancelOrder: (orderId: string) => Promise<void>
}

export function mapBackendOrderToOrder(req: any): FoodOrder {
  const statusMap: Record<string, FoodOrderStatus> = {
    'Received': 'Pending',
    'Preparing': 'Preparing',
    'Ready': 'OutForDelivery',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled',
  }
  
  const menuItems = useMenuStore.getState().items
  
  const mappedItems = (req.items || req.order_items || []).map((item: any) => {
    const matchedMenu = menuItems.find(m => m.id === String(item.menu_item))
    return {
      menuItemId: String(item.menu_item),
      name: item.menu_item_name || matchedMenu?.name || `Item #${item.menu_item}`,
      quantity: item.quantity,
      unitPrice: Math.round(Number(item.price_at_order || 0) * 100)
    }
  })
  
  return {
    id: String(req.id),
    orderedById: req.employee ? String(req.employee) : '',
    status: statusMap[req.status] ?? 'Pending',
    items: mappedItems,
    totalAmount: Math.round(Number(req.total_price || 0) * 100),
    deliveryLocation: req.delivery_location_name || req.delivery_location_desc || String(req.delivery_location || ''),
    createdAt: req.order_date || new Date().toISOString(),
    updatedAt: req.order_date || new Date().toISOString(),
    estimatedReadyAt: req.estimated_ready_at || undefined,
    notes: req.notes || ''
  }
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,

  async fetchOrders() {
    set({ isLoading: true })
    try {
      const { data } = await apiClient.get('/orders/')
      const mapped = data.map(mapBackendOrderToOrder)
      set({ orders: mapped })
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  async placeOrder(draft) {
    set({ isLoading: true })
    try {
      // Map location text to null or number
      const locationId = draft.deliveryLocation && draft.deliveryLocation.trim() !== '' ? Number(draft.deliveryLocation) : null
      
      const payload = {
        delivery_location: locationId,
        notes: draft.notes || '',
        items: draft.items.map(item => ({
          menu_item: Number(item.menuItemId),
          quantity: item.quantity
        }))
      }
      const { data } = await apiClient.post('/orders/place_order/', payload)
      const newOrder = mapBackendOrderToOrder(data)
      set((state) => ({ orders: [newOrder, ...state.orders] }))
      return newOrder
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message
      throw new Error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  async updateStatus(orderId, newStatus) {
    const backendStatusMap: Record<FoodOrderStatus, string> = {
      'Pending': 'Received',
      'Preparing': 'Preparing',
      'OutForDelivery': 'Ready',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled',
    }
    const backendStatus = backendStatusMap[newStatus] || newStatus
    
    try {
      const { data } = await apiClient.post(`/orders/${orderId}/update_status/`, {
        status: backendStatus
      })
      const updated = mapBackendOrderToOrder(data)
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o))
      }))
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
  },

  async cancelOrder(orderId) {
    try {
      const { data } = await apiClient.post(`/orders/${orderId}/update_status/`, {
        status: 'Cancelled'
      })
      const updated = mapBackendOrderToOrder(data)
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o))
      }))
    } catch (err) {
      console.error('Failed to cancel order:', err)
    }
  }
}))
