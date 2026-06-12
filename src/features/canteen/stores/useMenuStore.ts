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
      category = 'Snacks'
    } else {
      category = 'Lunch'
    }
  }

  // Normalize category to be consistent across portals (Breakfast, Lunch, Snacks, Drinks)
  if (category === 'Lunch Specials') {
    category = 'Lunch'
  } else if (category === 'Snacks & Drinks') {
    category = 'Snacks'
  }

  const isAvail = (item.stock_quantity ?? 0) > 0

  const resolveImage = (path?: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    if (path.startsWith('http')) return path
    return `https://smart-office-backend-production.up.railway.app${path}`
  }

  return {
    id: String(item.id),
    name: item.name,
    price: Math.round(Number(item.price || 0) * 100),
    description: description,
    category: category,
    inStock: isAvail,
    isAvailable: isAvail,
    imageUrl: resolveImage(item.image_path),
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
      if (data.length === 0) {
        // Seed default items
        const defaultItems = [
          { name: 'Avocado Truffle Sourdough', price: 850, description: 'Fresh avocado, white truffle oil, cherry tomatoes on organic sourdough toast.', category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600' },
          { name: 'Acai Power Berry Bowl', price: 1000, description: 'Organic acai blend topped with sliced strawberries, bananas, chia seeds, and gluten-free granola.', category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=600' },
          { name: 'Seared Salmon Quinoa Salad', price: 1450, description: 'Pan-seared Atlantic salmon over a bed of warm organic quinoa, kale, and lemon-herb dressing.', category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600' },
          { name: 'Artisanal Chicken Pesto Panini', price: 1200, description: 'Grilled chicken breast, nut-free basil pesto, fresh mozzarella, and tomato on artisan ciabatta.', category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600' },
          { name: 'Slow-Drip Nitro Cold Brew', price: 450, description: 'Nitrogen-infused cold brew coffee, smooth and creamy draft texture.', category: 'Drinks', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600' },
          { name: 'Ceremonial Matcha Latte', price: 500, description: 'Whisked organic stone-ground green tea matcha with hot steamed oat milk.', category: 'Drinks', imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600' },
          { name: 'Himalayan Salted Chocolate Cookie', price: 300, description: 'Soft-baked dark chocolate chip cookie topped with coarse pink Himalayan sea salt flakes.', category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600' }
        ];

        for (const item of defaultItems) {
          try {
            await get().addMenuItem(item);
          } catch (e) {
            console.error('Failed to seed item:', item.name, e);
          }
        }
        
        // Re-fetch
        const { data: freshData } = await apiClient.get('/menu-items/')
        const mapped = freshData.map(mapBackendMenuItem)
        set({ items: mapped })
      } else {
        const mapped = data.map(mapBackendMenuItem)
        set({ items: mapped })
      }
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
