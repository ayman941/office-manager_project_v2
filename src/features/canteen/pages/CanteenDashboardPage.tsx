import { useState, useEffect } from 'react'
import { useOrderStore } from '@/features/food/stores/useOrderStore'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { UtensilsCrossed, MapPin, X, Egg, Coffee, TrendingUp, Trash2, ChevronRight } from 'lucide-react'

export function CanteenDashboardPage() {
  const { orders, updateStatus, cancelOrder, fetchOrders } = useOrderStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const [activeTab, setActiveTab] = useState<'Pending' | 'Preparing' | 'OutForDelivery'>('Pending')

  useEffect(() => {
    fetchOrders()
    fetchEmployees()
  }, [fetchOrders, fetchEmployees])

  const displayedOrders = orders.filter(o => o.status === activeTab)

  const counts = {
    Pending: orders.filter(o => o.status === 'Pending').length,
    Preparing: orders.filter(o => o.status === 'Preparing').length,
    OutForDelivery: orders.filter(o => o.status === 'OutForDelivery').length,
  }

  const getNextStatus = (current: string) => {
    if (current === 'Pending') return 'Preparing'
    if (current === 'Preparing') return 'OutForDelivery'
    if (current === 'OutForDelivery') return 'Delivered'
    return current
  }

  const getActionText = (current: string) => {
    if (current === 'Pending') return 'Start Prep'
    if (current === 'Preparing') return 'Mark Ready'
    if (current === 'OutForDelivery') return 'Mark Delivered'
    return 'Done'
  }

  return (
    <div className="pt-24 px-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Live Orders Bento Grid */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-4 border-b-0 overflow-x-auto pb-2 no-scrollbar">
            {(['Pending', 'Preparing', 'OutForDelivery'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-bold shadow-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {tab === 'Pending' ? 'Incoming' : tab === 'OutForDelivery' ? 'Out for Delivery' : tab} ({counts[tab]})
              </button>
            ))}
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedOrders.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400">No orders in this status.</div>
            ) : (
              displayedOrders.map(order => (
                <div key={order.id} className="bg-surface-container-lowest p-5 rounded-[2rem] shadow-sm border border-outline-variant/10 group hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Order #{order.id.split('-')[1] || order.id}</span>
                      <h3 className="font-headline text-lg font-extrabold text-on-surface">
                        {employees.find(e => e.id === order.orderedById)?.name || order.orderedById || 'Guest'}
                      </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'Pending' ? 'bg-tertiary-container/10 text-tertiary-container' : 'bg-secondary-container/30 text-on-secondary-container'}`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                          <UtensilsCrossed className="text-primary" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-on-surface leading-tight truncate">{item.name}</p>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-surface-container-low rounded-2xl mb-5">
                    <MapPin className="text-slate-400" size={18} />
                    <span className="text-xs font-semibold text-on-surface-variant tracking-tight truncate">{order.deliveryLocation || 'Pickup'}</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(order.id, getNextStatus(order.status) as any)}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      {getActionText(order.status)}
                    </button>
                    <button 
                      onClick={() => cancelOrder(order.id)}
                      className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Inventory & Metrics */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Inventory Summary Card */}
          <div className="bg-surface-container p-6 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-lg font-extrabold text-on-surface tracking-tight">Core Inventory</h3>
              <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Manage All</button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-lowest rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <Egg className="text-tertiary" size={20} />
                    <span className="text-sm font-bold text-on-surface">Fresh Eggs</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">42/150 units</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="w-[28%] h-full bg-error rounded-full"></div>
                </div>
                <p className="text-[10px] text-error font-bold uppercase mt-2">Critical Stock Level</p>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <Coffee className="text-primary" size={20} />
                    <span className="text-sm font-bold text-on-surface">Arabica Beans</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">12.5/20 kg</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="w-[62%] h-full bg-secondary rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-wider">Sufficient Stock</p>
              </div>
            </div>
          </div>

          {/* Staff Performance/Quick Metrics Card */}
          <div className="bg-primary p-6 rounded-[2rem] text-white overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="font-headline text-lg font-extrabold mb-4 tracking-tight">Today's Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Avg Prep Time</p>
                  <p className="text-2xl font-black">12m</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Peak Load</p>
                  <p className="text-2xl font-black">12:30</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-secondary-container rounded-2xl flex items-center gap-4 text-on-secondary-container">
                <TrendingUp size={32} />
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest leading-none mb-1">Revenue Pace</p>
                  <p className="text-lg font-black leading-none">+12.4% vs prev Mon</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          </div>

          {/* Waste Log Action */}
          <button className="w-full p-5 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-[2rem] flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-on-surface-variant group-hover:rotate-12 transition-transform">
                <Trash2 size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-on-surface tracking-tight">Log Daily Waste</h4>
                <p className="text-xs text-slate-500">Record kitchen surplus</p>
              </div>
            </div>
            <ChevronRight className="text-slate-400" size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
