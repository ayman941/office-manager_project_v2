import { create } from 'zustand'
import apiClient from '@/lib/apiClient'

export type MenuCategory = 'Breakfast' | 'Lunch' | 'Snacks' | 'Drinks' | 'Lunch Specials' | 'Snacks & Drinks' | string

export interface MenuItem {
  id: string
  name: string
  price: number // in cents
  description: string
  category: MenuCategory
  inStock: boolean      // for MenuManagementPage.tsx parity
  isAvailable: boolean  // for NewFoodOrderPage.tsx and types/index.ts parity
  imageUrl: string
  tags?: string[]
}

interface MenuStore {
  items: MenuItem[]
  isLoading: boolean
  fetchMenuItems: () => Promise<void>
  toggleStock: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  addMenuItem: (item: {
    name: string
    price: number // in cents
    description: string
    category: string
    imageUrl?: string
  }) => Promise<void>
}

export function mapBackendMenuItem(item: any): MenuItem {
  let category = 'Breakfast'
  let description = ''
  
  if (item.allergen_info && item.allergen_info.includes('|')) {
    const parts = item.allergen_info.split('|')
    category = parts[0] || 'Breakfast'
    description = parts.slice(1).join('|') || ''
  } else {
    description = item.allergen_info || ''
    // Guess category from name for backward-compatibility with unencoded items
    const n = item.name.toLowerCase()
    if (n.includes('egg') || n.includes('toast') || n.includes('smoothie') || n.includes('acai') || n.includes('yogurt') || n.includes('breakfast')) {
      category = 'Breakfast'
    } else if (n.includes('coffee') || n.includes('tea') || n.includes('drink') || n.includes('latte') || n.includes('brew') || n.includes('bar') || n.includes('cookie') || n.includes('snack')) {
      category = 'Snacks & Drinks'
    } else {
      category = 'Lunch Specials'
    }
  }

  const isAvail = (item.stock_quantity ?? 0) > 0

  return {
    id: String(item.id),
    name: item.name,
    price: Math.round(Number(item.price || 0) * 100),
    description: description,
    category: category,
    inStock: isAvail,
    isAvailable: isAvail,
    imageUrl: item.image_path || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: []
  }
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  items: [],
  isLoading: false,

  async fetchMenuItems() {
    set({ isLoading: true })
    try {
      const { data } = await apiClient.get('/menu-items/')
      const mapped = data.map(mapBackendMenuItem)
      set({ items: mapped })
    } catch (err) {
      console.error('Failed to fetch menu items:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  async toggleStock(id) {
    const item = get().items.find(i => i.id === id)
    if (!item) return
    
    // Toggle between stock of 0 and 50
    const newStock = item.inStock ? 0 : 50
    try {
      const { data } = await apiClient.patch(`/menu-items/${id}/`, {
        stock_quantity: newStock
      })
      const updated = mapBackendMenuItem(data)
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i))
      }))
    } catch (err) {
      console.error('Failed to toggle menu item stock:', err)
    }
  },

  async deleteItem(id) {
    try {
      await apiClient.delete(`/menu-items/${id}/`)
      set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      }))
    } catch (err) {
      console.error('Failed to delete menu item:', err)
    }
  },

  async addMenuItem(draft) {
    try {
      const payload = {
        name: draft.name,
        price: (draft.price / 100).toFixed(2),
        cost: (draft.price / 150).toFixed(2),
        stock_quantity: 50,
        min_threshold: 5,
        base_prep_time: 15,
        image_path: draft.imageUrl || '',
        allergen_info: `${draft.category}|${draft.description}`
      }
      const { data } = await apiClient.post('/menu-items/', payload)
      const newItem = mapBackendMenuItem(data)
      set((state) => ({
        items: [...state.items, newItem]
      }))
    } catch (err) {
      console.error('Failed to add menu item:', err)
      throw err;
    }
  }
}))
