import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { useLeaveStore } from '@/stores/useLeaveStore'
import { UserPlus, Users, UserCheck, Plane, UserMinus, Search, Filter, Download, Eye, Edit2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'

export function HRDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [previewEmployee, setPreviewEmployee] = useState<any | null>(null)

  const { employees: allEmployees, fetchEmployees, isLoading } = useEmployeeStore()
  const { leaves, fetchLeaves } = useLeaveStore()

  useEffect(() => {
    fetchEmployees()
    fetchLeaves()
  }, [fetchEmployees, fetchLeaves])

  const roles = ['All', ...Array.from(new Set(allEmployees.map(e => e.role)))]

  const filteredEmployees = allEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'All' || emp.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Dynamic stats based on filtered employees
  const todayStr = new Date().toLocaleDateString('en-CA')
  const employeeOnLeaveIds = leaves
    .filter(l => l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr)
    .map(l => l.requestedById)

  const onLeaveCount = filteredEmployees.filter(emp => employeeOnLeaveIds.includes(emp.id)).length
  const activeCount = Math.max(0, filteredEmployees.length - onLeaveCount)
  const offboardingCount = Math.round(filteredEmployees.length * 0.05)

  const getRoleDisplayName = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  const formatJoinDate = (isoString?: string) => {
    if (!isoString) return 'Joined Jan 2026'
    try {
      const d = new Date(isoString)
      return `Joined ${d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    } catch {
      return 'Joined Jan 2026'
    }
  }

  const handleExportCSV = () => {
    if (filteredEmployees.length === 0) {
      alert('No data to export.')
      return
    }
    const headers = ['ID', 'Name', 'Email', 'Role', 'Join Date']
    const rows = filteredEmployees.map(emp => [
      `U${emp.id}`,
      emp.name,
      emp.email,
      emp.role,
      emp.createdAt ? new Date(emp.createdAt).toLocaleDateString('en-CA') : '2026-06-12'
    ])
    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `employee_directory_${new Date().toLocaleDateString('en-CA')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
      {/* Page Header & Action */}
      <div className="flex items-end justify-between">
        <div>
          <nav className="flex gap-2 text-xs font-bold text-primary mb-2 tracking-widest uppercase">
            <span>Directory</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Employees</span>
          </nav>
          <h2 className="text-4xl font-extrabold text-on-surface font-headline tracking-tighter">Employee Directory</h2>
          <p className="text-on-surface-variant mt-1">Manage and monitor your organization's workforce from a central hub.</p>
        </div>
        <Link to="/hr/directory/new" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <UserPlus size={20} />
          Add New Employee
        </Link>
      </div>

      {/* Dashboard Stats Summary (Bento Minimal) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Employees</p>
            <p className="text-2xl font-black text-on-surface">{allEmployees.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Now</p>
            <p className="text-2xl font-black text-on-surface">{activeCount}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-tertiary-container/30 rounded-lg flex items-center justify-center text-tertiary">
            <Plane size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">On Leave</p>
            <p className="text-2xl font-black text-on-surface">{onLeaveCount}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center text-error">
            <UserMinus size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offboarding</p>
            <p className="text-2xl font-black text-on-surface">{offboardingCount}</p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden border border-outline-variant/10">
        {/* Table Controls */}
        <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="pl-9 pr-4 py-2 bg-surface-container rounded-lg border-none text-sm focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-slate-400" 
                placeholder="Search..." 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role:</span>
              <select 
                className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer text-primary p-0 py-1"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role === 'All' ? 'All Roles' : getRoleDisplayName(role)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
              <Filter size={20} />
            </button>
            <button 
              onClick={handleExportCSV}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              title="Export to CSV"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Employee Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Employee ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading employees...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No employees found.</td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0">
                          {emp.avatarUrl ? (
                            <img alt={emp.name} className="w-full h-full object-cover" src={emp.avatarUrl} />
                          ) : (
                            emp.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface whitespace-nowrap">{emp.name}</p>
                          <p className="text-xs text-slate-400">{formatJoinDate(emp.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">#U{emp.id}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant font-medium whitespace-nowrap">{getRoleDisplayName(emp.role)}</td>
                    <td className="px-6 py-4 text-sm text-[#00677F]">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 transition-opacity">
                        <button onClick={() => setPreviewEmployee(emp)} className="p-2 hover:bg-white rounded-lg text-primary shadow-sm" title="View Profile">
                          <Eye size={18} />
                        </button>
                        <Link to={`/hr/directory/${emp.id}/edit`} className="p-2 hover:bg-white rounded-lg text-slate-500 shadow-sm" title="Edit">
                          <Edit2 size={18} />
                        </Link>
                        <button className="p-2 hover:bg-white rounded-lg text-slate-500 shadow-sm" title="More Actions">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/10">
          {filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No employees found.</div>
          ) : (
            filteredEmployees.map(emp => (
              <div key={emp.id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0">
                      {emp.avatarUrl ? (
                        <img alt={emp.name} className="w-full h-full object-cover" src={emp.avatarUrl} />
                      ) : (
                        emp.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{emp.name}</p>
                      <p className="text-xs text-slate-400">#U{emp.id}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
                    Active
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-on-surface-variant font-medium">{getRoleDisplayName(emp.role)}</p>
                  <p className="text-[#00677F] mt-1">{emp.email}</p>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/10">
                  <button onClick={() => setPreviewEmployee(emp)} className="p-2 hover:bg-slate-100 rounded-lg text-primary" title="View Profile">
                    <Eye size={18} />
                  </button>
                  <Link to={`/hr/directory/${emp.id}/edit`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Edit">
                    <Edit2 size={18} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 flex items-center justify-between border-t border-surface-container bg-surface-container-low/30">
          <p className="text-sm text-slate-500 font-medium">Showing <span className="text-on-surface font-bold">{filteredEmployees.length > 0 ? 1 : 0}-{filteredEmployees.length}</span> of <span className="text-on-surface font-bold">{allEmployees.length}</span> employees</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container text-slate-400 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-md shadow-primary/20">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container text-slate-400 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Meta Area */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs">AM</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary text-white flex items-center justify-center text-xs">HR</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+12</div>
          </div>
          <p className="text-xs font-medium text-slate-500">HR Admins currently managing this list</p>
        </div>
        <div className="text-xs text-slate-400 italic">Last sync: 4 minutes ago</div>
      </div>

      {/* Employee Preview Modal */}
      {previewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-outline-variant/10 relative text-left animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-extrabold text-on-surface mb-6 font-headline text-cyan-900 dark:text-cyan-100">Employee Profile</h3>
            
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center text-slate-400 text-3xl font-bold overflow-hidden border-2 border-primary">
                {previewEmployee.avatarUrl ? (
                  <img alt={previewEmployee.name} className="w-full h-full object-cover" src={previewEmployee.avatarUrl} />
                ) : (
                  previewEmployee.name.charAt(0)
                )}
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-on-surface">{previewEmployee.name}</h4>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">#U{previewEmployee.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400">Role</p>
                <p className="text-sm font-bold text-on-surface mt-0.5">{getRoleDisplayName(previewEmployee.role)}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400">Email Address</p>
                <p className="text-sm font-bold text-primary mt-0.5">{previewEmployee.email}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400">Join Date</p>
                <p className="text-sm font-bold text-on-surface mt-0.5">{formatJoinDate(previewEmployee.createdAt)}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setPreviewEmployee(null)}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all w-full"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
