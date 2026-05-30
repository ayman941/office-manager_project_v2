import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Button, Card, EmptyState, Badge } from '@/shared/ui'
import { useAuth } from '@/features/auth/useAuth'
import { useOrderStore } from '../stores/useOrderStore'
import { formatTime } from '@/utils/dateUtils'
import { FoodOrderStatus } from '@/types'

// Helper for the stepper
const STATUS_STAGES: FoodOrderStatus[] = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered']

function OrderStepper({ currentStatus }: { currentStatus: FoodOrderStatus }) {
  if (currentStatus === 'Cancelled') {
    return <p className="text-sm text-red-500 font-medium">Order Cancelled</p>
  }

  const currentIndex = STATUS_STAGES.indexOf(currentStatus)

  return (
    <div className="flex items-center justify-between mt-4 relative">
      {/* Background track */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full" />
      
      {/* Active track */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 rounded-full transition-all duration-500" 
        style={{ width: `${(currentIndex / (STATUS_STAGES.length - 1)) * 100}%` }}
      />

      {STATUS_STAGES.map((stage, index) => {
        const isCompleted = index <= currentIndex
        const isActive = index === currentIndex
        
        return (
          <div key={stage} className="relative flex flex-col items-center">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                isCompleted 
                  ? 'bg-brand-600 border-brand-600 text-white' 
                  : 'bg-white border-gray-300 text-transparent'
              }`}
            >
              {isCompleted && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {/* Stage Label */}
            <span className={`absolute top-8 text-xs font-medium whitespace-nowrap ${
              isActive ? 'text-brand-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'
            }`}>
              {stage.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function FoodOrderList() {
  const { user } = useAuth()
  const { orders, fetchOrders } = useOrderStore()
  
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const userOrders = orders.filter(o => o.orderedById === user?.id)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
        <Link to="/employee/food/new">
          <Button size="sm">New Order</Button>
        </Link>
      </div>

      {userOrders.length === 0 ? (
        <EmptyState 
          title="No food orders yet"
          description="You haven't placed any food orders today."
          action={{ label: 'Order Food', onClick: () => window.location.href = '/employee/food/new' }}
        />
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Order #{order.id.split('-')[1]}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Placed at {formatTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge status={order.status} />
                  <Link to={`/employee/food/track/${order.id}`}>
                    <Button variant="secondary" size="sm">Track Order</Button>
                  </Link>
                </div>
              </div>

              <OrderStepper currentStatus={order.status} />

              {/* Add bottom padding to account for the absolute positioned labels in stepper */}
              <div className="h-8" />
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900 mb-2">Order Items:</p>
                <ul className="space-y-1">
                  {order.items.map(item => (
                    <li key={item.menuItemId} className="text-sm text-gray-600 flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${((item.quantity * item.unitPrice) / 100).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-50 font-semibold text-gray-900 text-sm">
                  <span>Total</span>
                  <span>${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
