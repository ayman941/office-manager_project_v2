import { useState } from 'react'
import { useInventoryStore, InventoryCategory, StockStatus } from '@/features/canteen/stores/useInventoryStore'
import { ListAlt, Warning, LocalShipping, RefreshCw, Plus, FilterList, Edit } from 'lucide-react'

export function InventoryManagementPage() {
  const { items } = useInventoryStore()
  const [activeFilter, setActiveFilter] = useState<InventoryCategory>('All Categories')

  const categories: InventoryCategory[] = ['All Categories', 'Vegetables', 'Dairy & Eggs', 'Dry Goods', 'Beverages']

  const filteredItems = items.filter(item => activeFilter === 'All Categories' || item.category === activeFilter)

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case 'Optimal': return 'bg-secondary'
      case 'Healthy': return 'bg-primary'
      case 'Low Stock': return 'bg-error'
      case 'Critical': return 'bg-error'
      default: return 'bg-outline'
    }
  }

  const getStatusTextColor = (status: StockStatus) => {
    switch (status) {
      case 'Optimal': return 'text-on-secondary-container'
      case 'Healthy': return 'text-primary'
      case 'Low Stock': return 'text-error'
      case 'Critical': return 'text-error'
      default: return 'text-on-surface-variant'
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Items */}
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden group shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">list_alt</span>
            </div>
            <span className="text-xs font-bold text-primary px-2 py-1 bg-primary-fixed rounded-full">+12 new</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant font-medium">Total Items</p>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface mt-1">1,248</h3>
          </div>
          <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4 rounded-full"></div>
          </div>
        </div>

        {/* Card 2: Low Stock Alerts */}
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-error/10 rounded-lg text-error">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <span className="text-xs font-bold text-error px-2 py-1 bg-error-container rounded-full">Action Required</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant font-medium">Low Stock Alerts</p>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface mt-1">14</h3>
          </div>
          <p className="text-xs text-error font-medium">3 items critically low (below 5%)</p>
        </div>

        {/* Card 3: Recent Deliveries */}
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <button className="text-xs font-bold text-secondary hover:underline">View History</button>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant font-medium">Recent Deliveries</p>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface mt-1">28</h3>
          </div>
          <p className="text-xs text-on-surface-variant">Last delivery: Today, 8:45 AM</p>
        </div>
      </div>

      {/* Inventory Table Section */}
      <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">Inventory Management</h2>
            <p className="text-on-surface-variant text-sm mt-1">Manage food supplies, dry goods, and equipment levels.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-surface-container-highest transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">refresh</span>
              Update Stock
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-sm active:scale-95 transition-all">
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === cat ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              {cat}
            </button>
          ))}
          
          <div className="ml-auto flex items-center gap-2 text-on-surface-variant text-sm border-l border-outline-variant pl-4">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Filter by: Stock Level</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-on-surface-variant text-sm uppercase tracking-wider font-bold">
                <th className="px-4 py-3 pb-4">Item Name</th>
                <th className="px-4 py-3 pb-4">Category</th>
                <th className="px-4 py-3 pb-4">Stock Level</th>
                <th className="px-4 py-3 pb-4">Unit</th>
                <th className="px-4 py-3 pb-4">Last Updated</th>
                <th className="px-4 py-3 pb-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredItems.map(item => (
                <tr key={item.id} className="bg-surface hover:bg-surface-container-low transition-colors group">
                  <td className="px-4 py-4 rounded-l-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img alt={item.name} className="w-full h-full object-cover" src={item.imageUrl} />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${item.category === 'Dry Goods' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary/10 text-secondary'}`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-on-surface">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-on-surface-variant">{item.category}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full ${getStatusColor(item.status)}`} style={{ width: `${item.stockPercentage}%` }}></div>
                      </div>
                      <span className={`${getStatusTextColor(item.status)} font-bold text-xs uppercase`}>{item.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-on-surface-variant">{item.unit}</td>
                  <td className="px-4 py-4 text-on-surface-variant">{item.lastUpdated}</td>
                  <td className="px-4 py-4 rounded-r-xl">
                    <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">edit_note</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant font-medium">Showing 1 to {filteredItems.length} of 1,248 items</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-outline-variant hover:text-primary transition-colors" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-primary text-on-primary text-xs font-bold shadow-md shadow-primary/30">1</button>
            <button className="w-8 h-8 rounded-full text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-all">2</button>
            <button className="w-8 h-8 rounded-full text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-all">3</button>
            <span className="text-outline-variant text-xs">...</span>
            <button className="w-8 h-8 rounded-full text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-all">312</button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Timeline */}
        <div className="bg-surface-container-low p-8 rounded-xl shadow-sm">
          <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Delivery Schedule
          </h3>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
            <div className="flex gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center z-10 shadow-sm">
                <span className="material-symbols-outlined text-xs text-on-secondary-container" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Dairy Delivery Received</p>
                <p className="text-xs text-on-surface-variant mt-1">Order #DX-9021 by FreshDaily Co.</p>
                <span className="text-[10px] font-bold text-outline uppercase mt-2 block">Today, 08:45 AM</span>
              </div>
            </div>
            
            <div className="flex gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center z-10 shadow-sm shadow-primary/20">
                <span className="material-symbols-outlined text-xs text-on-primary-fixed" style={{ fontVariationSettings: "'wght' 700" }}>local_shipping</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Grain & Flour Incoming</p>
                <p className="text-xs text-on-surface-variant mt-1">Courier: Apex Logistics • ETA 1h 20m</p>
                <span className="text-[10px] font-bold text-primary uppercase mt-2 block">In Transit</span>
              </div>
            </div>
            
            <div className="flex gap-4 relative opacity-50">
              <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center z-10"></div>
              <div>
                <p className="text-sm font-bold text-on-surface">Produce Market Restock</p>
                <p className="text-xs text-on-surface-variant mt-1">Scheduled for Tomorrow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Quick Action */}
        <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between overflow-hidden relative shadow-lg shadow-primary/20">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-lg mb-2">Replenishment Assistant</h3>
            <p className="text-primary-fixed-dim text-sm opacity-90 leading-relaxed">
              Based on your current consumption patterns and upcoming meal plan for "International Pasta Day," you are projected to run out of <span className="font-bold text-on-primary underline decoration-secondary-fixed">Semolina Flour</span> within 48 hours.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-4 relative z-10">
            <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed">auto_awesome</span>
                <span className="text-sm font-medium">Smart Order Recommendation</span>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">25kg bulk</span>
            </div>
            <button className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-primary-fixed transition-all active:scale-[0.98] shadow-md hover:shadow-lg">
              Approve & Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
