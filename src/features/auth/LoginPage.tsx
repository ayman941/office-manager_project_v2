import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { HelpCircle, Building2, User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Shield } from 'lucide-react'

const ROLE_HOME: Record<string, string> = {
  employee:   '/employee/dashboard',
  manager:    '/manager/dashboard',
  hr_manager: '/hr/dashboard',
  canteen:    '/canteen/dashboard',
}

export function LoginPage() {
  const { user, login, isLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Redirect to portal if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      navigate(ROLE_HOME[user.role] ?? '/employee/dashboard', { replace: true })
    }
  }, [user, isLoading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const role = await login(email, password) ?? 'employee'
      navigate(ROLE_HOME[role] ?? '/', { replace: true })
    } catch {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body selection:bg-secondary-container">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-primary font-headline">SmartOffice</div>
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-primary transition-colors active:scale-95 duration-200">
              <HelpCircle size={24} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBTZDsoFuLKKSOMkdoPRaIT3PrQLuOurn2ZxSDKzBoKAGFbfA08aQApURyZvRstBKjs9-exW28BYByV6SWZl6o2wtHGJ4gL4NyvhEml6dsLqebJWLONzDaZAKyz-sPxteHzcvoUw_Ooq1FWwQxaO2UEN_HfIZRthmGxOpePv2Qx8tVe0_H7xe5YJpjqtOzYmNs_xGS7ziil9aI6djZa174O0TXut7c9Pqj-Lybyw5jQFfHmWmic_Nej5veDz97qcY8RJUYoB8Py0I')"
            }}
          ></div>
        </div>
        
        <div className="w-full max-w-md z-10">
          <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/10 p-10 relative">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container mb-6 text-on-primary-container shadow-sm">
                <Building2 size={32} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Welcome Back</h1>
              <p className="text-on-surface-variant text-sm font-medium">Please enter your workplace credentials</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary ml-1" htmlFor="username">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60 text-sm font-medium" 
                    id="username" 
                    placeholder="Enter your username" 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary" htmlFor="password">Password</label>
                  <a className="text-xs font-bold text-primary hover:text-primary/80 transition-colors" href="#">Forgot Password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
                  <input 
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60 text-sm font-medium" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="px-1 text-critical text-xs font-bold bg-error-container/20 py-2 rounded-lg text-center">
                  {error}
                </div>
              )}
              
              <div className="flex items-center px-1">
                <div className="flex items-center h-5">
                  <input className="w-4 h-4 text-primary bg-surface-container-high border-0 rounded-md focus:ring-offset-0 focus:ring-2 focus:ring-primary/20" id="remember" type="checkbox"/>
                </div>
                <label className="ml-3 text-sm font-bold text-on-surface-variant cursor-pointer" htmlFor="remember">Keep me signed in</label>
              </div>
              
              <button 
                className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl shadow-card hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-sm font-medium text-on-surface-variant mb-4">
                New to the platform? 
                <a className="text-primary font-bold hover:underline ml-1" href="#">Contact Administrator</a>
              </p>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Demo Accounts</p>
                <p className="text-xs text-on-surface-variant font-medium">
                  admin · employee_demo · manager_demo
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-wider shadow-sm border border-outline-variant/10">
              <ShieldCheck size={16} className="text-success" />
              SSO Enabled
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-wider shadow-sm border border-outline-variant/10">
              <Shield size={16} className="text-primary" />
              Encrypted
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-surface-container-low border-t border-outline-variant/10 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-8 space-y-4 md:space-y-0 max-w-screen-2xl mx-auto">
          <div className="text-lg font-bold font-headline text-on-surface">SmartOffice</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">© 2024 Smart Office Systems. All rights reserved.</div>
          <div className="flex space-x-6">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest" href="#">Security</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage;
