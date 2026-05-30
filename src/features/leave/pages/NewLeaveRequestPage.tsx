import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useLeaveStore } from '@/stores/useLeaveStore'
import type { LeaveType } from '@/types'

export function NewLeaveRequestPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { submitLeave, settings, myBalance, fetchMyBalance } = useLeaveStore()

  const [type, setType] = useState<LeaveType>('Annual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyBalance()
  }, [fetchMyBalance])

  const overallUtilization = useMemo(() => {
    const annual = myBalance?.annualBalance ?? 21
    const sick = myBalance?.sickBalance ?? 7
    const emergency = myBalance?.emergencyBalance ?? 3
    const remaining = annual + sick + emergency
    const totalMax = 31
    const used = Math.max(0, totalMax - remaining)
    return Math.round((used / totalMax) * 100)
  }, [myBalance])

  const daysCount = useMemo(() => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) return 0

    let count = 0
    const current = new Date(start)
    while (current <= end) {
      if (settings.excludeWeekends) {
        if (current.getDay() !== 0 && current.getDay() !== 6) {
          count++
        }
      } else {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  }, [startDate, endDate, settings.excludeWeekends])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || daysCount === 0) return
    setError(null)

    try {
      await submitLeave({
        requestedById: user.id,
        type,
        startDate,
        endDate,
        reason
      })
      navigate('/employee/leave')
    } catch (err: any) {
      setError(err.message || 'Failed to submit leave request')
    }
  }

  return (
    <div className="pt-8 pb-12 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Leave Balance Summary */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            </div>
            <h3 className="text-primary uppercase text-xs font-extrabold tracking-widest mb-6">Current Balance</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary-container mr-4">
                    <span className="material-symbols-outlined text-[20px]">event_available</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Annual Leave</p>
                    <p className="text-xs text-slate-500">Valid until Dec 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary">
                    {String(myBalance?.annualBalance ?? 21).padStart(2, '0')}{' '}
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Days</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container mr-4">
                    <span className="material-symbols-outlined text-[20px]">medical_services</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Sick Leave</p>
                    <p className="text-xs text-slate-500">Standard annual quota</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-secondary">
                    {String(myBalance?.sickBalance ?? 7).padStart(2, '0')}{' '}
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Days</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant mr-4">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Emergency</p>
                    <p className="text-xs text-slate-500">Manager approval required</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-tertiary">
                    {String(myBalance?.emergencyBalance ?? 3).padStart(2, '0')}{' '}
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Days</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500">Overall Utilization</span>
                <span className="text-xs font-black text-primary">{overallUtilization}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${overallUtilization}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-primary-container p-6 rounded-xl text-white relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <p className="font-headline font-bold text-lg leading-tight mb-2">Planning a long vacation?</p>
              <p className="text-xs text-on-primary-container opacity-90 leading-relaxed mb-4">Remember to submit requests at least 2 weeks in advance for trips longer than 5 business days.</p>
              <a className="text-xs font-bold underline underline-offset-4 hover:text-white" href="#">Read Policy</a>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <span className="material-symbols-outlined text-9xl">beach_access</span>
            </div>
          </div>
        </div>

        {/* Right Column: Leave Request Form */}
        <div className="lg:w-2/3">
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
            <header className="mb-10 relative z-10">
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline mb-2">Application Details</h2>
              <p className="text-slate-500 text-sm">Please fill in the information below to submit your leave request for approval.</p>
            </header>
            
            <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-critical/10 border border-critical/30 text-critical p-4 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-critical">error</span>
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              )}
              {/* Leave Type Row */}
              <div className="grid grid-cols-1 gap-6">
                <div className="group">
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-primary mb-3">Leave Type</label>
                  <div className="relative">
                    <select 
                      required
                      value={type}
                      onChange={(e) => setType(e.target.value as LeaveType)}
                      className="w-full bg-surface-container-high border-0 rounded-lg py-4 px-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all appearance-none cursor-pointer"
                    >
                      <option value="Annual">Annual Leave</option>
                      <option value="Sick">Sick Leave</option>
                      <option value="Emergency">Emergency Leave</option>
                      <option value="Unpaid">Unpaid Leave</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Pickers Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-primary mb-3">Start Date</label>
                  <div className="relative">
                    <input 
                      required
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface-container-high border-0 rounded-lg py-4 px-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-primary mb-3">End Date</label>
                  <div className="relative">
                    <input 
                      required
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-surface-container-high border-0 rounded-lg py-4 px-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dynamic Day Count Display */}
              {daysCount > 0 && (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">calculate</span>
                  <p className="text-sm font-semibold text-primary">
                    Requesting <span className="font-black text-lg">{daysCount}</span> day(s)
                    {settings.excludeWeekends && <span className="font-normal text-xs ml-2 opacity-80">(Weekends excluded)</span>}
                  </p>
                </div>
              )}

              {/* Reason Textarea */}
              <div className="group">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-primary mb-3">Reason for Leave</label>
                <textarea 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-surface-container-high border-0 rounded-lg py-4 px-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all resize-none" 
                  placeholder="Briefly describe the reason for your request..." 
                  rows={4}
                ></textarea>
              </div>

              {/* Submission Info Box */}
              <div className="flex items-start p-4 bg-surface-container-low rounded-lg border-l-4 border-primary/30">
                <span className="material-symbols-outlined text-primary-container mr-3 mt-0.5">info</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your request will be sent to your manager for review. You'll receive a notification once a decision has been made.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-outline-variant/10">
                <button 
                  onClick={() => navigate('/employee/leave')}
                  className="px-8 py-3.5 rounded-lg text-sm font-bold text-slate-500 hover:bg-surface-container-high transition-colors" 
                  type="button"
                >
                  Cancel
                </button>
                <button 
                  disabled={daysCount === 0}
                  className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-3.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all" 
                  type="submit"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
