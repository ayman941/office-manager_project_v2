import { useState } from 'react'
import { Card, Badge, Button } from '@/shared/ui'
import { SEED_USERS } from '@/features/auth/AuthContext'
import { useLeaveStore } from '@/stores/useLeaveStore'
import { useAuth } from '@/features/auth/useAuth'
import { Settings } from 'lucide-react'

export function LeaveAuditPage() {
  const { user } = useAuth()
  const { leaves, auditLeave, settings, updateSettings } = useLeaveStore()
  
  const [filter, setFilter] = useState<'All' | 'Unreviewed' | 'Flagged'>('All')

  // Only show approved or rejected leaves for audit (HR doesn't audit pending)
  let auditList = leaves.filter(l => l.status !== 'Pending' && l.status !== 'Cancelled')
  
  if (filter === 'Unreviewed') auditList = auditList.filter(l => l.hrAuditStatus === 'Unreviewed')
  if (filter === 'Flagged') auditList = auditList.filter(l => l.hrAuditStatus === 'Flagged')

  const handleAudit = (leaveId: string, status: 'Confirmed' | 'Flagged') => {
    if (!user) return
    const note = status === 'Flagged' ? prompt('Enter reason for flagging this record:') : undefined
    if (status === 'Flagged' && !note) return // cancelled prompt
    
    auditLeave(leaveId, status, user.id, note || undefined)
  }

  const unreviewedCount = leaves.filter(l => l.status !== 'Pending' && l.hrAuditStatus === 'Unreviewed').length
  const flaggedCount = leaves.filter(l => l.status !== 'Pending' && l.hrAuditStatus === 'Flagged').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col tablet:flex-row tablet:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leave Audit</h2>
          <p className="text-sm text-gray-500 mt-1">Review approved/rejected leaves for compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === 'All' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('All')}>All</Button>
          <Button variant={filter === 'Unreviewed' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('Unreviewed')}>
            Unreviewed {unreviewedCount > 0 && `(${unreviewedCount})`}
          </Button>
          <Button variant={filter === 'Flagged' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('Flagged')}>
            Flagged {flaggedCount > 0 && `(${flaggedCount})`}
          </Button>
        </div>
      </div>

      <Card className="p-5 bg-gray-50/50 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Global Leave Settings</h3>
            <p className="text-sm text-gray-500">Configure how the system calculates leave duration.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <input 
            type="checkbox" 
            id="excludeWeekends"
            checked={settings.excludeWeekends}
            onChange={(e) => updateSettings({ excludeWeekends: e.target.checked })}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
          />
          <label htmlFor="excludeWeekends" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            Exclude weekends from days count
          </label>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Leave Period</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Manager Decision</th>
                <th className="px-5 py-3 font-medium">HR Audit Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No records match this filter.
                  </td>
                </tr>
              ) : (
                auditList.map(leave => {
                  const emp = Object.values(SEED_USERS).find(u => u.id === leave.requestedById)
                  const mgr = Object.values(SEED_USERS).find(u => u.id === leave.reviewedById)
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{emp?.name || 'Unknown'}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {leave.startDate} to {leave.endDate} ({leave.daysCount}d)
                      </td>
                      <td className="px-5 py-4 text-gray-600">{leave.type}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <Badge status={leave.status as any} />
                          <span className="text-xs text-gray-400">by {mgr?.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                           leave.hrAuditStatus === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                           leave.hrAuditStatus === 'Flagged' ? 'bg-red-50 text-red-700 border-red-200' :
                           'bg-gray-50 text-gray-600 border-gray-200'
                         }`}>
                           {leave.hrAuditStatus}
                         </span>
                         {leave.hrAuditNote && <p className="text-xs text-gray-500 mt-1 max-w-[150px] truncate" title={leave.hrAuditNote}>Note: {leave.hrAuditNote}</p>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {leave.hrAuditStatus === 'Unreviewed' && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => handleAudit(leave.id, 'Confirmed')}>Confirm</Button>
                            <Button size="sm" variant="danger" onClick={() => handleAudit(leave.id, 'Flagged')}>Flag</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
