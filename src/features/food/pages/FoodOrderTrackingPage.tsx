import { useParams, Link } from 'react-router-dom'
import { useOrderStore } from '@/features/food/stores/useOrderStore'
import { useMenuStore } from '@/features/canteen/stores/useMenuStore'
import { FoodOrderStatus } from '@/types'
import { useEffect } from 'react'

const STATUS_STAGES: FoodOrderStatus[] = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered']

export function FoodOrderTrackingPage() {
  const { orderId } = useParams()
  const { orders, fetchOrders } = useOrderStore()
  const { fetchMenuItems } = useMenuStore()
  
  useEffect(() => {
    fetchOrders()
    fetchMenuItems()
  }, [fetchOrders, fetchMenuItems])

  // Find the order, or default to the most recent one if no ID provided
  const order = orderId 
    ? orders.find(o => o.id === orderId) 
    : orders.length > 0 ? orders[orders.length - 1] : null

  if (!order) {
    return <div className="p-8 text-center text-on-surface">Order not found.</div>
  }

  const currentStatusIndex = STATUS_STAGES.indexOf(order.status)
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 w-full p-4 md:p-8 pb-32">
      {/* Back & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Link to="/employee/food" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 mb-4 transition-colors">
            <span className="material-symbols-outlined mr-1 text-sm">arrow_back_ios</span> Back to Orders
          </Link>
          <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Track Your Meal</h1>
          <p className="text-on-surface-variant flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
            Estimated delivery in <span className="font-bold text-primary">12 mins</span>
          </p>
        </div>
        <div className="bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/20 shadow-sm">
          <span className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mr-2">Order ID:</span>
          <span className="font-mono font-bold text-primary">#{order.id.split('-')[0].toUpperCase()}</span>
        </div>
      </div>

      {/* Bento Status Tracker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Step 1: Received */}
        <div className={`relative p-6 rounded-3xl overflow-hidden flex flex-col items-center text-center transition-all ${currentStatusIndex >= 0 ? 'bg-surface-container-lowest shadow-lg shadow-primary/5 border border-primary/10' : 'bg-surface-container opacity-50'}`}>
          {currentStatusIndex === 0 && <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl pointer-events-none"></div>}
          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-3 ${currentStatusIndex >= 0 ? 'bg-primary text-white' : 'bg-surface-container-highest text-outline'}`}>
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
          <p className="relative z-10 font-bold font-headline text-on-surface">Received</p>
          <p className="relative z-10 text-xs text-on-surface-variant mt-1">12:30 PM</p>
        </div>
        
        {/* Step 2: Preparing */}
        <div className={`relative p-6 rounded-3xl overflow-hidden flex flex-col items-center text-center transition-all ${currentStatusIndex >= 1 ? 'bg-surface-container-lowest shadow-lg shadow-primary/5 border border-primary/10' : 'bg-surface-container opacity-50'}`}>
          {currentStatusIndex === 1 && <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl pointer-events-none"></div>}
          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-3 ${currentStatusIndex >= 1 ? 'bg-primary text-white' : 'bg-surface-container-highest text-outline'} ${currentStatusIndex === 1 ? 'animate-pulse' : ''}`}>
            <span className="material-symbols-outlined">restaurant</span>
          </div>
          <p className="relative z-10 font-bold font-headline text-on-surface">Preparing</p>
          <p className="relative z-10 text-xs text-on-surface-variant mt-1">Expected 12:45</p>
        </div>
        
        {/* Step 3: Out for Delivery */}
        <div className={`relative p-6 rounded-3xl overflow-hidden flex flex-col items-center text-center transition-all ${currentStatusIndex >= 2 ? 'bg-surface-container-lowest shadow-lg shadow-primary/5 border border-primary/10' : 'bg-surface-container opacity-50'}`}>
          {currentStatusIndex === 2 && <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl pointer-events-none"></div>}
          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-3 ${currentStatusIndex >= 2 ? 'bg-primary text-white' : 'bg-surface-container-highest text-outline'} ${currentStatusIndex === 2 ? 'animate-pulse' : ''}`}>
            <span className="material-symbols-outlined">moped</span>
          </div>
          <p className="relative z-10 font-bold font-headline text-on-surface">On the Way</p>
          <p className="relative z-10 text-xs text-on-surface-variant mt-1">Scheduled</p>
        </div>
        
        {/* Step 4: Delivered */}
        <div className={`relative p-6 rounded-3xl overflow-hidden flex flex-col items-center text-center transition-all ${currentStatusIndex >= 3 ? 'bg-surface-container-lowest shadow-lg shadow-primary/5 border border-primary/10' : 'bg-surface-container opacity-50'}`}>
          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-3 ${currentStatusIndex >= 3 ? 'bg-success text-white' : 'bg-surface-container-highest text-outline'}`}>
            <span className="material-symbols-outlined">task_alt</span>
          </div>
          <p className="relative z-10 font-bold font-headline text-on-surface">Delivered</p>
          <p className="relative z-10 text-xs text-on-surface-variant mt-1">Arrival</p>
        </div>
      </div>

      {/* Asymmetric Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Summary */}
        <div className="lg:col-span-7 space-y-8">
          {/* Order Content */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-outline-variant/10">
            <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-3 text-on-surface">
              Order Summary
              <span className="bg-secondary-container text-on-secondary-container text-xs px-3 py-1 rounded-full">{order.items.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
            </h2>
            <ul className="space-y-6">
              {order.items.map(item => (
                <li key={item.menuItemId} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-low overflow-hidden flex items-center justify-center text-primary/30 shrink-0">
                      <span className="material-symbols-outlined text-3xl">fastfood</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{item.name}</h4>
                      <p className="text-sm text-on-surface-variant">Standard Prep</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-primary">x{item.quantity}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-dashed border-outline-variant/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-on-surface-variant font-medium">Subtotal</span>
                <span className="text-on-surface font-medium">${(order.totalAmount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface font-bold text-lg">Total</span>
                <span className="text-primary font-black text-xl">${(order.totalAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Details & Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivery Location Card */}
          <div className="bg-primary text-white p-8 rounded-[2rem] shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">my_location</span>
                Delivery Location
              </h3>
              <div className="flex items-start gap-4">
                <div>
                  <h4 className="text-2xl font-bold font-headline leading-tight">East Wing, Floor 4</h4>
                  <p className="text-white/70 mt-1">{order.deliveryLocation || 'Flexi-Desk #402 (Window side)'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Context Map/Illustration */}
          <div className="bg-surface-container-low rounded-[2rem] overflow-hidden aspect-square relative group border border-outline-variant/10 shadow-sm">
            {/* Map Placeholder Image */}
            <img 
              alt="Office Floor Plan" 
              className="w-full h-full object-cover opacity-70 mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
            
            {/* Floating Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-secondary-container/80 animate-ping absolute inset-0"></div>
                <div className="w-16 h-16 rounded-full bg-secondary-container backdrop-blur-md flex items-center justify-center relative shadow-xl text-on-secondary-container">
                  <span className="material-symbols-outlined text-[28px]">pin_drop</span>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-lg border border-white/40">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container shrink-0">
                  <span className="material-symbols-outlined text-xl">directions_bike</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Delivery Partner</p>
                  <p className="text-primary font-bold leading-tight">Marcus is approaching</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-4 bg-surface-container-lowest text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/5 border border-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">support_agent</span>
            Contact Kitchen Staff
          </button>
        </div>
      </div>
    </div>
  )
}
