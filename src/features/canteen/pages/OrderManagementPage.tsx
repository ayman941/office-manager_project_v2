import { Card, Button, Badge, EmptyState } from '@/shared/ui'
import { useOrderStore } from '@/features/food/stores/useOrderStore'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { formatTime } from '@/utils/dateUtils'
import { FoodOrderStatus } from '@/types'
import { useEffect } from 'react'

export function OrderManagementPage() {
  const { orders, updateStatus, cancelOrder, fetchOrders } = useOrderStore()
  const { employees, fetchEmployees } = useEmployeeStore()

  useEffect(() => {
    fetchOrders()
    fetchEmployees()
  }, [fetchOrders, fetchEmployees])

  // We primarily want to see active orders in the queue
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // oldest first

  const handleStatusAdvance = (orderId: string, currentStatus: FoodOrderStatus) => {
    let nextStatus: FoodOrderStatus | null = null
    if (currentStatus === 'Pending') nextStatus = 'Preparing'
    else if (currentStatus === 'Preparing') nextStatus = 'OutForDelivery'
    else if (currentStatus === 'OutForDelivery') nextStatus = 'Delivered'

    if (nextStatus) {
      updateStatus(orderId, nextStatus)
    }
  }

  const getActionLabel = (status: FoodOrderStatus) => {
    switch (status) {
      case 'Pending': return 'Start Preparing'
      case 'Preparing': return 'Send Out for Delivery'
      case 'OutForDelivery': return 'Mark Delivered'
      default: return ''
    }
  }

  const getEmployeeName = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId)
    return emp ? emp.name : `Employee #${employeeId}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Live Order Queue</h2>
        <span className="bg-brand-100 text-brand-800 text-sm font-semibold px-3 py-1 rounded-full">
          {activeOrders.length} Active Orders
        </span>
      </div>

      {activeOrders.length === 0 ? (
        <EmptyState 
          title="All caught up!"
          description="There are no active orders in the queue."
        />
      ) : (
        <div className="grid grid-cols-1 desktop:grid-cols-2 wide:grid-cols-3 gap-4">
          {activeOrders.map(order => (
            <Card key={order.id} className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.id.split('-')[1]} • {getEmployeeName(order.orderedById)}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{formatTime(order.createdAt)} • {order.deliveryLocation}</p>
                  </div>
                  <Badge status={order.status} />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <ul className="space-y-1">
                    {order.items.map(item => (
                      <li key={item.menuItemId} className="text-sm font-medium text-gray-700 flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                      </li>
                    ))}
                  </ul>
                  {order.notes && (
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded border border-amber-100">
                      Note: {order.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button 
                  className="flex-1"
                  onClick={() => handleStatusAdvance(order.id, order.status)}
                >
                  {getActionLabel(order.status)}
                </Button>
                {order.status === 'Pending' && (
                  <Button 
                    variant="danger" 
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this order?')) {
                        cancelOrder(order.id)
                      }
                    }}
                    title="Cancel Order"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
