import { useOrderStore } from '@/features/food/stores/useOrderStore'
import { Card } from '@/shared/ui'
import { Users, DollarSign, BarChart2, Coffee } from 'lucide-react'

export function HRConsumptionPage() {
  const { orders } = useOrderStore()

  // Filter to completed/delivered orders
  const validOrders = orders.filter((o) => o.status !== 'Cancelled')

  const totalCompanySpent = validOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  
  // Calculate top items
  const itemCounts: Record<string, { name: string, quantity: number, cost: number }> = {}
  validOrders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCounts[item.menuItemId]) {
        itemCounts[item.menuItemId] = { name: item.name, quantity: 0, cost: 0 }
      }
      itemCounts[item.menuItemId].quantity += item.quantity
      itemCounts[item.menuItemId].cost += (item.quantity * item.unitPrice)
    })
  })

  const topItems = Object.values(itemCounts).sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  // Calculate top spenders
  const spenderCosts: Record<string, number> = {}
  validOrders.forEach(order => {
    if (!spenderCosts[order.orderedById]) spenderCosts[order.orderedById] = 0
    spenderCosts[order.orderedById] += order.totalAmount
  })
  const topSpenders = Object.entries(spenderCosts)
    .map(([userId, cost]) => ({ userId, cost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5)

  return (
    <div className="p-4 tablet:p-8 space-y-6 max-w-7xl mx-auto pb-32">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-on-surface font-headline">Company Consumption</h1>
          <p className="text-sm text-outline font-medium">Track total internal food and beverage costs</p>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-primary">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-outline uppercase tracking-wider">Total Internal Cost</p>
            <p className="text-2xl font-black text-on-surface">${(totalCompanySpent / 100).toFixed(2)}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-secondary">
          <div className="p-3 bg-secondary/20 text-tertiary-container rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-outline uppercase tracking-wider">Active Consumers</p>
            <p className="text-2xl font-black text-on-surface">{Object.keys(spenderCosts).length}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-success">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-outline uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-on-surface">{validOrders.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Items */}
        <div>
          <h2 className="text-lg font-bold font-headline text-on-surface mb-4">Top Consumed Items</h2>
          <Card className="overflow-hidden">
            {topItems.length === 0 ? (
              <div className="p-8 text-center text-outline">No items consumed yet.</div>
            ) : (
              <ul className="divide-y divide-outline-variant/10">
                {topItems.map((item, idx) => (
                  <li key={idx} className="p-4 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-container text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </div>
                      <span className="font-bold text-on-surface">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{item.quantity} units</p>
                      <p className="text-xs text-outline">${(item.cost / 100).toFixed(2)} total cost</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Top Spenders */}
        <div>
          <h2 className="text-lg font-bold font-headline text-on-surface mb-4">Highest Cost by Employee</h2>
          <Card className="overflow-hidden">
            {topSpenders.length === 0 ? (
              <div className="p-8 text-center text-outline">No employee data.</div>
            ) : (
              <ul className="divide-y divide-outline-variant/10">
                {topSpenders.map((spender, idx) => (
                  <li key={spender.userId} className="p-4 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {spender.userId.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-on-surface">Employee {spender.userId.split('-')[0]}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary">${(spender.cost / 100).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <h2 className="text-lg font-bold font-headline text-on-surface mt-10 mb-4">Recent Transactions</h2>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-xs uppercase tracking-wider text-outline font-bold">
                <th className="p-4">Date</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Items</th>
                <th className="p-4 text-right">Internal Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {validOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10).map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 text-on-surface-variant flex items-center gap-2 whitespace-nowrap">
                     {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-mono text-outline">{order.orderedById.split('-')[0]}</td>
                  <td className="p-4 text-on-surface font-medium">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
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
    </div>
  )
}
