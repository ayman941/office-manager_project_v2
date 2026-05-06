import { create } from 'zustand'

export type MenuCategory = 'Breakfast' | 'Lunch' | 'Snacks' | 'Drinks'

export interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  category: MenuCategory
  inStock: boolean
  imageUrl: string
}

interface MenuStore {
  items: MenuItem[]
  toggleStock: (id: string) => void
  deleteItem: (id: string) => void
}

const MOCK_MENU: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Poached Egg Sourdough',
    price: 12.50,
    description: 'Two farm-fresh poached eggs on toasted sourdough with micro-greens and chili flakes.',
    category: 'Breakfast',
    inStock: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzrPfrSBfOW9H8LZ1tWzvzvYJgODQpCFIOMe5dgGwjqh0VGLQfaEX4Dl_FsukxRpG6mjCZd6kWe7dPUXKVtaKi3A2glVs53bBL3CNwiWr9TRHBCLWz3Zw5rGRrvwB425si1mcxHzjkFNp5GAjYfvzuXbiSoI27vRSnVHmJcYhiAR0zqKRFI-J3r-nHQQUNo5DFlgZZ7YjirTzq_61pq8tPkbEA2ix32p6cirEb_3VQS8M7TvXLv7SfRed3hk5l5uPDONsZ0bu5wxNH'
  },
  {
    id: 'menu-2',
    name: 'Berry Bliss Acai',
    price: 9.00,
    description: 'Organic Brazilian acai topped with seasonal berries, house-made granola, and honey drizzle.',
    category: 'Breakfast',
    inStock: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPNsOrO3uFB6Z_SDPDKCjQPIDEyszSCDNg73CBR8nfi3Scx_uZ-95kVVfHPMXK0LjAb6F0znpxctw7LJckMEXrJ-poiM8k6qWdEWJj5jvPUvuML7i8urZjG7Gu9zFXpcP8kUt8xO4OIjifSo5RFnE4IzRZndJcXHZ88ck-5kDpnHF4HsU0v63u7-WQmNCJvWkvFe9fOA99Q7GJoUH6Ek2SYShaVgUHKZnrNegRkTYyclfT96HSfsqYIuunbfc3ijGpE73Pyr2bQq0T'
  },
  {
    id: 'menu-3',
    name: 'Walnut Yogurt Bowl',
    price: 7.50,
    description: 'Greek yogurt base, premium toasted walnuts, and local wildflower honey infusion.',
    category: 'Breakfast',
    inStock: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM6VV8RbPyPMPcSljKJVmjJZAed3LJpnIm3LTSGK_wlFs-jmO_KrO_yCiDzSU_wx8TCF-emqpNx5NbQAtXrnGbO14TV-B6rMgtZP-atXWfSc4HaiBXTW9SE_ObUFtX-uxSp1Hmb_3qNIOHmsV-L6AN6uiEA5HKIPcec2ThVnAAnU59wfGDKScfKVa4v9_u60R90WMWYICvcjuy85GM2uo21oqZ_4CTQcI8nTgnErNRLZDlJOKKe_zWdSLPKlSQXpNs3sbYbhYCjcyN'
  }
]

export const useMenuStore = create<MenuStore>((set) => ({
  items: MOCK_MENU,
  toggleStock: (id) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    )
  })),
  deleteItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  }))
}))
