import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RoleGuard }    from '@/components/navigation/RoleGuard'
import { LoginPage }    from '@/features/auth/LoginPage'
import { EmployeeLayout } from '@/features/auth/layouts/EmployeeLayout'
import { ManagerLayout }  from '@/features/auth/layouts/ManagerLayout'
import { CanteenLayout }  from '@/features/auth/layouts/CanteenLayout'

// Employee pages
import { EmployeeDashboard }     from '@/features/employee/pages/EmployeeDashboard'
import { FoodOrderList }         from '@/features/food/pages/FoodOrderList'
import { NewFoodOrderPage }      from '@/features/food/pages/NewFoodOrderPage'
import { FoodOrderTrackingPage } from '@/features/food/pages/FoodOrderTrackingPage'
import { LeaveRequestListPage }  from '@/features/leave/pages/LeaveRequestListPage'
import { NewLeaveRequestPage }   from '@/features/leave/pages/NewLeaveRequestPage'
import { MyAttendancePage }      from '@/features/employee/pages/MyAttendancePage'
import { EmployeeConsumptionPage }       from '@/features/employee/pages/EmployeeConsumptionPage'

// Manager pages
import { ManagerDashboardPage }    from '@/features/manager/pages/ManagerDashboardPage'
import { LeaveApprovalQueuePage }  from '@/features/manager/pages/LeaveApprovalQueuePage'
import { TeamOverviewPage }        from '@/features/manager/pages/TeamOverviewPage'

// Canteen pages
import { CanteenDashboardPage }  from '@/features/canteen/pages/CanteenDashboardPage'
import { OrderManagementPage }   from '@/features/canteen/pages/OrderManagementPage'
import { MenuManagementPage }    from '@/features/canteen/pages/MenuManagementPage'
import { InventoryManagementPage } from '@/features/canteen/pages/InventoryManagementPage'

// HR pages
import { HRLayout }              from '@/features/hr/layouts/HRLayout'
import { HRDashboardPage }       from '@/features/hr/pages/HRDashboardPage'
import { HRDirectoryPage }       from '@/features/hr/pages/HRDirectoryPage'
import { LeaveAuditPage }        from '@/features/hr/pages/LeaveAuditPage'
import { AttendanceLogPage }     from '@/features/hr/pages/AttendanceLogPage'
import { EmployeeAttendancePage } from '@/features/hr/pages/EmployeeAttendancePage'
import { HRConsumptionReportPage }     from '@/features/hr/pages/HRConsumptionReportPage'
import { HREmployeeFormPage }    from '@/features/hr/pages/HREmployeeFormPage'

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <div>
        <p className="text-4xl">🔒</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500 mt-2 text-sm">You don't have permission to view this page.</p>
        <a href="/login" className="mt-4 inline-block text-brand-600 underline text-sm">Back to login</a>
      </div>
    </div>
  )
}

function PlaceholderSettings({ role }: { role: string }) {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">{role} Settings</h1>
      <p className="text-gray-500">Configure your personal preferences, notifications, and application layout style parameters.</p>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Mock Configuration Panel</h2>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span>Dark Mode Preference</span>
          <button className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold">Toggle</button>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span>Email Push Notifications</span>
          <button className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold">Enabled</button>
        </div>
      </div>
    </div>
  )
}

function PlaceholderOrgStats() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Organization Statistics</h1>
      <p className="text-gray-500">Overview of department counts, role allocations, and overall workforce productivity metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Workforce Distribution</h2>
          <p className="text-sm text-gray-500">Marketing, Engineering, HR, and Operations metrics are computed in real-time.</p>
        </div>
      </div>
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Employee Portal */}
        <Route
          path="/employee"
          element={
            <RoleGuard allowedRoles={['employee', 'manager', 'hr_manager', 'canteen']}>
              <EmployeeLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="attendance" element={<MyAttendancePage />} />
          <Route path="leave"     element={<LeaveRequestListPage />} />
          <Route path="leave/new" element={<NewLeaveRequestPage />} />
          <Route path="food"      element={<NewFoodOrderPage />} />
          <Route path="orders"    element={<FoodOrderList />} />
          <Route path="consumption" element={<EmployeeConsumptionPage />} />
          <Route path="food/track/:orderId" element={<FoodOrderTrackingPage />} />
          <Route path="settings"  element={<PlaceholderSettings role="employee" />} />
        </Route>

        {/* Manager Portal */}
        <Route
          path="/manager"
          element={
            <RoleGuard allowedRoles={['manager']}>
              <ManagerLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="leave"     element={<LeaveApprovalQueuePage />} />
          <Route path="team"      element={<TeamOverviewPage />} />
          <Route path="settings"  element={<PlaceholderSettings role="manager" />} />
        </Route>

        {/* Canteen Portal */}
        <Route
          path="/canteen"
          element={
            <RoleGuard allowedRoles={['canteen']}>
              <CanteenLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CanteenDashboardPage />} />
          <Route path="orders"    element={<OrderManagementPage />} />
          <Route path="menu"      element={<MenuManagementPage />} />
          <Route path="inventory" element={<InventoryManagementPage />} />
          <Route path="settings"  element={<PlaceholderSettings role="canteen" />} />
        </Route>

        {/* HR Portal */}
        <Route
          path="/hr"
          element={
            <RoleGuard allowedRoles={['hr_manager']}>
              <HRLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<HRDashboardPage />} />
          <Route path="directory"   element={<HRDirectoryPage />} />
          <Route path="directory/new" element={<HREmployeeFormPage />} />
          <Route path="directory/:id/edit" element={<HREmployeeFormPage />} />
          <Route path="attendance"  element={<AttendanceLogPage />} />
          <Route path="attendance/:employeeId" element={<EmployeeAttendancePage />} />
          <Route path="leave-audit" element={<LeaveAuditPage />} />
          <Route path="consumption" element={<HRConsumptionReportPage />} />
          <Route path="settings"    element={<PlaceholderSettings role="hr" />} />
          <Route path="org-stats"   element={<PlaceholderOrgStats />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
