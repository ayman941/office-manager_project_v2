import { Card } from '@/shared/ui'
import { SEED_USERS } from '@/features/auth/AuthContext'
import { useAuth } from '@/features/auth/useAuth'

export function TeamOverviewPage() {
  const { user } = useAuth()
  
  const allEmployees = Object.values(SEED_USERS)
  // Filter only direct reports
  const directReports = allEmployees.filter(emp => emp.managerId === user?.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Team</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your direct reports.</p>
      </div>

      {directReports.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-sm text-center py-4">You have no direct reports.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {directReports.map(emp => (
            <Card key={emp.id} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                {emp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{emp.role}</p>
                <a href={`mailto:${emp.email}`} className="text-xs text-brand-600 mt-1 hover:underline">{emp.email}</a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
