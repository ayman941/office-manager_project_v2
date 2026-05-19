import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { SEED_USERS } from '@/features/auth/AuthContext'
import { 
  ChevronRight, 
  User, 
  Camera, 
  Edit2, 
  Briefcase, 
  CalendarCheck, 
  ShieldCheck, 
  Info, 
  Sparkles 
} from 'lucide-react'

export function HREmployeeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const isEditing = Boolean(id)
  const existingUser = id ? Object.values(SEED_USERS).find(u => u.id === id || u.id === `u${id}`) : null

  // In a real app, this would use react-hook-form or similar
  const [formData, setFormData] = useState({
    name: existingUser?.name || '',
    email: existingUser?.email || '',
    phone: '',
    employeeId: existingUser?.id || `SO-${Math.floor(Math.random() * 10000)}`,
    joinDate: existingUser?.createdAt?.split('T')[0] || '',
    department: existingUser?.departmentId || 'Product Design',
    jobTitle: '',
    manager: existingUser?.managerId || '',
    adminAccess: existingUser?.role === 'hr_manager' || existingUser?.role === 'manager'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    // Mock save behavior
    navigate('/hr/directory')
  }

  return (
    <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-32">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <Link to="/hr/directory" className="hover:text-primary transition-colors">Directory</Link>
            <ChevronRight size={14} />
            <span className="text-primary font-bold">{isEditing ? 'Edit Employee' : 'Add Employee'}</span>
          </nav>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">
            {isEditing ? 'Edit Employee' : 'Add / Edit Employee'}
          </h2>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => navigate('/hr/directory')}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-surface-container-high text-primary font-bold text-sm hover:brightness-95 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] md:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Primary Details */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Section: Personal Information */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border-none shadow-card">
            <div className="flex items-center gap-2 mb-8">
              <User className="text-primary" size={24} />
              <h3 className="text-lg font-bold text-on-surface tracking-tight">Personal Information</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-10">
              {/* Profile Upload */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-2xl bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-dashed border-outline-variant group-hover:border-primary transition-colors">
                    <Camera className="text-slate-400 group-hover:text-primary transition-colors" size={40} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg pointer-events-none">
                    <Edit2 size={14} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center">Profile Photo</p>
              </div>
              
              {/* Inputs Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface" 
                    placeholder="Johnathan Doe" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface" 
                    placeholder="j.doe@smartoffice.com" 
                    type="email"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface" 
                    placeholder="+1 (555) 000-0000" 
                    type="tel"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Section: Employment Details */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-8">
              <Briefcase className="text-primary" size={24} />
              <h3 className="text-lg font-bold text-on-surface tracking-tight">Employment Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID</label>
                <div className="relative">
                  <input 
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface" 
                    placeholder="SO-00245" 
                    type="text"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary cursor-pointer uppercase tracking-tighter">Auto-Gen</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Join Date</label>
                <input 
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface" 
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                >
                  <option>Product Design</option>
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                <input 
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface" 
                  placeholder="Senior UI Designer" 
                  type="text"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manager</label>
                <select 
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                >
                  <option>Sarah Jenkins (Head of Design)</option>
                  <option>Michael Chen (Lead Engineer)</option>
                  <option>Admin User (Global Admin)</option>
                </select>
              </div>
            </div>
          </section>
        </div>
        
        {/* Right Column: Balance & Access */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Section: Leave Balances */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <CalendarCheck className="text-primary" size={24} />
              <h3 className="text-lg font-bold text-on-surface tracking-tight">Leave Balances</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="text-xs font-bold text-on-surface">Annual Leave</p>
                  <p className="text-[10px] text-slate-500">Days per year</p>
                </div>
                <input className="w-16 bg-white border-none rounded-lg text-center font-bold text-primary focus:ring-2 focus:ring-primary/20" type="number" defaultValue="20"/>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="text-xs font-bold text-on-surface">Sick Leave</p>
                  <p className="text-[10px] text-slate-500">Available annually</p>
                </div>
                <input className="w-16 bg-white border-none rounded-lg text-center font-bold text-primary focus:ring-2 focus:ring-primary/20" type="number" defaultValue="10"/>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="text-xs font-bold text-on-surface">Emergency Leave</p>
                  <p className="text-[10px] text-slate-500">Discretionary</p>
                </div>
                <input className="w-16 bg-white border-none rounded-lg text-center font-bold text-primary focus:ring-2 focus:ring-primary/20" type="number" defaultValue="5"/>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="text-xs font-bold text-on-surface">Unpaid Leave</p>
                  <p className="text-[10px] text-slate-500">Taken to date</p>
                </div>
                <input className="w-16 bg-white border-none rounded-lg text-center font-bold text-primary focus:ring-2 focus:ring-primary/20" type="number" defaultValue="0"/>
              </div>
            </div>
          </section>
          
          {/* Section: System Access */}
          <section className="bg-primary-container text-on-primary-container rounded-2xl p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={24} />
              <h3 className="text-lg font-bold tracking-tight">System Access</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center pt-1">
                  <input 
                    name="adminAccess"
                    checked={formData.adminAccess}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-none bg-black/20 text-on-primary-container focus:ring-0" 
                    type="checkbox"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">Admin Access</p>
                  <p className="text-xs opacity-80 leading-relaxed mt-1">
                    Granting admin access allows this user to manage other employees, payroll settings, and directory entries.
                  </p>
                </div>
              </label>
            </div>
            
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-start gap-3">
              <Info className="shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] font-medium leading-tight opacity-90">
                Access levels can be modified later in the 'Permissions' sub-menu.
              </p>
            </div>
          </section>
          
          {/* Quick Action Tip */}
          <div className="bg-secondary-container p-6 rounded-2xl flex gap-4 shadow-card">
            <div className="bg-white/40 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="text-on-secondary-container" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-on-secondary-container">HR Suggestion</p>
              <p className="text-xs text-on-secondary-container/80 leading-relaxed mt-1">
                Based on this department, the recommended join-package is 'Standard Creative'.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
