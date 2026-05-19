import { useAuth } from '@/features/auth/useAuth'
import { useOrderStore } from '@/features/food/stores/useOrderStore'
import { Card } from '@/shared/ui'
import { Coffee, DollarSign, TrendingUp, Calendar } from 'lucide-react'

export function ConsumptionPage() {
  const { user } = useAuth()
  const { orders } = useOrderStore()

  // Filter to only this user's completed/delivered orders
  const userOrders = orders.filter(
    (o) => o.orderedById === user?.id && o.status !== 'Cancelled'
  )

  const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalItems = userOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  )

  // Get current month cost
  const currentMonth = new Date().getMonth()
  const thisMonthSpent = userOrders
    .filter((o) => new Date(o.createdAt).getMonth() === currentMonth)
    .reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <div className="p-4 tablet:p-8 space-y-6 max-w-7xl mx-auto pb-32">
      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-on-surface font-headline">My Consumption & Costs</h1>
        <p className="text-sm text-outline font-medium">Track your internal food and beverage consumption</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-primary">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-outline uppercase tracking-wider">Total Internal Cost</p>
            <p className="text-2xl font-black text-on-surface">${(totalSpent / 100).toFixed(2)}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-secondary">
          <div className="p-3 bg-secondary/20 text-tertiary-container rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-outline uppercase tracking-wider">This Month</p>
            <p className="text-2xl font-black text-on-surface">${(thisMonthSpent / 100).toFixed(2)}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-success">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <Coffee size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-outline uppercase tracking-wider">Items Consumed</p>
            <p className="text-2xl font-black text-on-surface">{totalItems}</p>
          </div>
        </Card>
      </div>

      {/* History */}
      <h2 className="text-lg font-bold font-headline text-on-surface mt-10 mb-4">Consumption History</h2>
      {userOrders.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-outline-variant/20">
          <Coffee className="mx-auto text-outline-variant mb-4" size={48} />
          <p className="text-on-surface-variant font-medium">No consumption recorded yet.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-xs uppercase tracking-wider text-outline font-bold">
                  <th className="p-4">Date</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Items</th>
                  <th className="p-4 text-right">Internal Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm">
                {userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 text-on-surface-variant flex items-center gap-2 whitespace-nowrap">
                      <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-mono text-outline">{order.id.split('-')[1]}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-on-surface font-medium">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">
                      ${(order.totalAmount / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
