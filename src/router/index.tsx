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
import { ConsumptionPage }       from '@/features/employee/pages/ConsumptionPage'

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
import { HRConsumptionPage }     from '@/features/hr/pages/HRConsumptionPage'
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
          <Route path="consumption" element={<ConsumptionPage />} />
          <Route path="food/track/:orderId" element={<FoodOrderTrackingPage />} />
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
          <Route path="consumption" element={<HRConsumptionPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
