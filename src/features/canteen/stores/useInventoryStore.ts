import { create } from 'zustand'

export type InventoryCategory = 'Vegetables' | 'Dairy & Eggs' | 'Dry Goods' | 'Beverages' | 'Meat' | 'All Categories'
export type StockStatus = 'Optimal' | 'Healthy' | 'Low Stock' | 'Critical'

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  stockPercentage: number
  status: StockStatus
  unit: string
  lastUpdated: string
  imageUrl?: string
  icon?: string // Used if imageUrl is missing
}

interface InventoryStore {
  items: InventoryItem[]
  updateStock: (id: string, percentage: number) => void
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Organic Milk 2%',
    category: 'Dairy & Eggs',
    stockPercentage: 15,
    status: 'Low Stock',
    unit: 'Liters',
    lastUpdated: '2h ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ADBb0uiUBUr7HQk35x2CrjkvzdlFM_MkJZKiO2pdbtSdXYy2H_oyX065M1YNXzNgbeaVVvDe-TPtMWFN_XmLmV3DdtaFHFNBjUDDAqFHOMkLr8uq1G5XBwsg34Y88MTjec4GNgbosCxJB9f_fXhNI3ITHIRZ9AOuHN_1YMmaZIjEylCc9nhIjAE_naLq5W_cdIy86F4k9PX3V5spcw4CmvtfsT6LYPq88Jo2GbJeQUb8Wt7z07i1sUZr225A4wdyZzJtI3mhXx_4sVsdNA'
  },
  {
    id: 'inv-2',
    name: 'Arabica Coffee Beans',
    category: 'Beverages',
    stockPercentage: 85,
    status: 'Optimal',
    unit: 'Kilograms',
    lastUpdated: 'Today, 09:12',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ADBb0uhen8AM2pLtlEqOvR_arpVLGTht7-EPzV4RhsqiI45EHavfWBGtGHLhy5wojbSgFp9N3FMwBeJ7brkxPq6SH_o17_DN2TnM7mkx_v8G8VN-uRsxRFlgO-RZaQcA86nGKX2jHZQbQSmXmL1qyOoGutgcaOwJjhgSXEPvYsx2rVJp4V42qoyaWIPGMoV6R5VfIozojKpPwqocAjVIv3bYlWr9CaLXb9tGtznuN5ICzeJGmgJugn-bMH8YirOR3ufNl_5JhQcjkvTcTEw'
  },
  {
    id: 'inv-3',
    name: 'Whole Wheat Flour',
    category: 'Dry Goods',
    stockPercentage: 45,
    status: 'Healthy',
    unit: 'Bags (5kg)',
    lastUpdated: 'Oct 24, 2023',
    icon: 'bakery_dining'
  },
  {
    id: 'inv-4',
    name: 'Large Grade A Eggs',
    category: 'Dairy & Eggs',
    stockPercentage: 8,
    status: 'Critical',
    unit: 'Cartons (12)',
    lastUpdated: '1h ago',
    icon: 'egg'
  }
]

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: MOCK_INVENTORY,
  updateStock: (id, percentage) => set((state) => ({
    items: state.items.map(item => {
      if (item.id === id) {
        let newStatus: StockStatus = 'Optimal'
        if (percentage <= 10) newStatus = 'Critical'
        else if (percentage <= 25) newStatus = 'Low Stock'
        else if (percentage <= 60) newStatus = 'Healthy'
        return { ...item, stockPercentage: percentage, status: newStatus }
      }
      return item
    })
  }))
}))
