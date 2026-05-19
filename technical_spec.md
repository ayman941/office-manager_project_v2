# Smart Office Manager — Technical Specification

> **Governed by:** [`speckit.constitution.md`](./speckit.constitution.md)
> **Stack:** React (Vite) · TypeScript · Tailwind CSS · Headless UI
> **Last Updated:** 2026-04-29 *(rev 2 — HR Manager role, Attendance, Leave Audit)*

---

## Table of Contents

1. [Data Models](#1-data-models)
2. [Navigation & RBAC (Portal Switcher)](#2-navigation--rbac-portal-switcher)
3. [Responsive Breakpoints](#3-responsive-breakpoints)
4. [File & Folder Structure](#4-file--folder-structure)
5. [State Management Contract](#5-state-management-contract)
6. [Attendance Logic](#6-attendance-logic)
7. [HR Leave Audit](#7-hr-leave-audit)

---

## 1. Data Models

All interfaces live in `src/types/index.ts` and are the single source of truth for the entire app.

### 1.1 Shared Enums & Primitive Types

```ts
// src/types/index.ts

export type UserRole = 'employee' | 'manager' | 'canteen' | 'hr_manager';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

/**
 * HR-level audit status applied on top of the manager's decision.
 * Sits separately from LeaveStatus so manager workflow is unchanged.
 */
export type LeaveAuditStatus = 'Unreviewed' | 'Confirmed' | 'Flagged';

export type FoodOrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled';

export type AttendanceLogSource = 'System' | 'Manual' | 'Override';
```

### 1.2 `User`

```ts
export interface User {
  id: string;                  // UUID
  name: string;
  email: string;
  avatarUrl?: string;          // optional profile picture
  role: UserRole;              // drives portal access
  departmentId: string;        // foreign key → Department
  managerId?: string;          // null for top-level managers
  createdAt: string;           // ISO 8601
}
```

### 1.3 `LeaveRequest`

```ts
export interface LeaveRequest {
  id: string;                  // UUID
  requestedById: string;       // → User.id
  reviewedById?: string;       // → User.id (manager); null while Pending
  type: 'Annual' | 'Sick' | 'Unpaid' | 'Maternity' | 'Paternity' | 'Other';
  status: LeaveStatus;
  startDate: string;           // ISO 8601 date string (YYYY-MM-DD)
  endDate: string;             // ISO 8601 date string (YYYY-MM-DD)
  daysCount: number;           // computed: endDate - startDate (excluding weekends)
  reason: string;
  reviewNote?: string;         // manager's comment on approval/rejection
  // ── HR Audit fields (added in rev 2) ──────────────────────────────────
  hrAuditStatus: LeaveAuditStatus;   // defaults to 'Unreviewed' on creation
  hrAuditById?: string;              // → User.id of hr_manager who reviewed
  hrAuditNote?: string;              // HR comment on Flagged records
  hrAuditedAt?: string;              // ISO 8601 timestamp
  createdAt: string;
  updatedAt: string;
}
```

### 1.4 `FoodOrder`

```ts
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;               // in local currency cents
  category: 'Breakfast' | 'Lunch Specials' | 'Snacks & Drinks' | string;
  imageUrl: string;
  tags?: string[];
  calories?: number;
  isAvailable: boolean;
  isChefSpecial?: boolean;
}

export interface FoodOrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;           // in local currency cents
}

export interface FoodOrder {
  id: string;                  // UUID
  orderedById: string;         // → User.id
  items: FoodOrderItem[];
  totalAmount: number;         // sum of (quantity × unitPrice) for all items
  status: FoodOrderStatus;
  deliveryLocation: string;    // e.g. "Floor 3 – Meeting Room B"
  estimatedReadyAt?: string;   // ISO 8601; set by Canteen when status → Preparing
  notes?: string;              // dietary notes / special requests
  createdAt: string;
  updatedAt: string;
}
```

> [!NOTE]
> `FoodOrder.status` is the **single source of truth** synced across Employee and Canteen views (per Constitution §4). Any status mutation must go through a shared `useOrderStore` action, never via local component state.

### 1.5 `AttendanceLog`

```ts
export interface AttendanceLog {
  id: string;                        // UUID
  employeeId: string;                // → User.id
  date: string;                      // YYYY-MM-DD (the working day)
  checkIn?: string;                  // ISO 8601 datetime (UTC)
  checkOut?: string;                 // ISO 8601 datetime (UTC); null if still checked in
  durationMinutes?: number;          // computed: checkOut - checkIn in minutes
  source: AttendanceLogSource;       // 'System' | 'Manual' | 'Override'
  override?: AttendanceOverride;     // present only when source === 'Override'
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceOverride {
  performedById: string;             // → User.id of the hr_manager who made the change
  reason: string;                    // mandatory justification
  originalCheckIn?: string;          // snapshot of the value before override
  originalCheckOut?: string;
  performedAt: string;               // ISO 8601 timestamp
}
```

> [!IMPORTANT]
> Only users with the `hr_manager` role may create or modify `AttendanceLog` records where `source !== 'System'`. Employee-facing check-in/check-out always produces `source: 'System'` logs automatically.

---

## 2. Navigation & RBAC (Portal Switcher)

### 2.1 Role → Portal Mapping

| Role         | Default Landing Route  | Accessible Routes                                                    |
|--------------|------------------------|----------------------------------------------------------------------|
| `employee`   | `/employee/dashboard`  | `/employee/*`                                                        |
| `manager`    | `/manager/dashboard`   | `/manager/*` + read-only `/employee/*`                               |
| `canteen`    | `/canteen/dashboard`   | `/canteen/*`                                                         |
| `hr_manager` | `/hr/dashboard`        | `/hr/*` — read access to all employee, leave, and attendance data    |

### 2.2 Portal Switcher Component

A **`<PortalSwitcher />`** is rendered in the top navigation bar across **all** layouts (Employee, Manager, HR, and Canteen). It is visible **only** to users with privileged roles (`manager`, `hr_manager`, `canteen`), allowing them to instantly toggle between their administrative view and the employee view.

```tsx
// src/components/navigation/PortalSwitcher.tsx

type Portal = 'manager' | 'employee' | 'hr';

interface PortalSwitcherProps {
  activePortal: Portal;
  onSwitch: (portal: Portal) => void;
}
```

`hr_manager` users see a **two-segment** switcher: **HR View · Employee View**.
`manager` users see **Manager View · Employee View**.
`canteen` users see **Canteen View · Employee View**.

The switcher renders as a pill-style toggle using Headless UI `RadioGroup`. It handles its own internal routing via `useNavigate()`, allowing privileged users to easily switch contexts while maintaining their global session role.

### 2.3 Route Guard (`<RoleGuard />`)

Every protected route is wrapped in a `<RoleGuard>` component:

```tsx
// src/components/navigation/RoleGuard.tsx

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode; // defaults to <Navigate to="/unauthorized" />
}
```

**Guard resolution order:**
1. If no authenticated session → redirect to `/login`.
2. If `user.role` is not in `allowedRoles` → render `fallback` (default: `/unauthorized`).
3. Otherwise → render `children`.

### 2.4 Route Definitions (React Router v6)

```tsx
// src/router/index.tsx

<Routes>
  {/* Public */}
  <Route path="/login"        element={<LoginPage />} />
  <Route path="/unauthorized" element={<UnauthorizedPage />} />

  {/* Employee Portal */}
  <Route path="/employee" element={<RoleGuard allowedRoles={['employee', 'manager', 'hr_manager', 'canteen']}><EmployeeLayout /></RoleGuard>}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard"   element={<EmployeeDashboard />} />
    <Route path="attendance"  element={<MyAttendancePage />} />
    <Route path="leave"       element={<LeaveRequestList />} />
    <Route path="leave/new"   element={<NewLeaveRequest />} />
    <Route path="food"        element={<FoodOrderList />} />
    <Route path="food/new"    element={<NewFoodOrder />} />
  </Route>

  {/* Manager Portal */}
  <Route path="/manager" element={<RoleGuard allowedRoles={['manager']}><ManagerLayout /></RoleGuard>}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard"   element={<ManagerDashboard />} />
    <Route path="leave"       element={<LeaveApprovalQueue />} />
    <Route path="team"        element={<TeamOverview />} />
  </Route>

  {/* Canteen Portal */}
  <Route path="/canteen" element={<RoleGuard allowedRoles={['canteen']}><CanteenLayout /></RoleGuard>}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard"   element={<CanteenDashboard />} />
    <Route path="orders"      element={<OrderManagement />} />
    <Route path="menu"        element={<MenuManagement />} />
  </Route>

  {/* HR Manager Portal */}
  <Route path="/hr" element={<RoleGuard allowedRoles={['hr_manager']}><HRLayout /></RoleGuard>}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard"    element={<HRDashboard />} />          {/* KPIs: headcount, today's attendance rate, leave trends */}
    <Route path="employees"    element={<AllEmployeesPage />} />     {/* Company-wide directory */}
    <Route path="attendance"   element={<AttendanceLogPage />} />    {/* Daily log table + override action */}
    <Route path="attendance/:employeeId" element={<EmployeeAttendancePage />} /> {/* Per-employee history */}
    <Route path="leave-audit"  element={<LeaveAuditPage />} />       {/* All approved leaves + hrAuditStatus filter */}
  </Route>

  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
```

### 2.5 Auth Context

```ts
// src/contexts/AuthContext.tsx

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

On successful login, `user.role` determines which portal the user is redirected to (see §2.1).

---

## 3. Responsive Breakpoints

The design system follows a **mobile-first** approach (per Constitution §1). The three canonical breakpoints are:

| Breakpoint name   | Min-width  | Target devices                               |
|-------------------|------------|----------------------------------------------|
| `mobile` (base)   | `0px`      | Phones (design target: 375px)                |
| `tablet`          | `640px`    | Large phones, tablets in portrait            |
| `desktop`         | `1024px`   | Tablets in landscape, small laptops          |
| `wide`            | `1440px`   | Large desktop / Canteen dashboard monitors   |

### 3.1 Tailwind Config Extension

```ts
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // Tailwind default 'sm' (640px) is kept but aliased for clarity
        tablet:  '640px',   // sm equivalent
        desktop: '1024px',  // lg equivalent
        wide:    '1440px',  // custom
      },
    },
  },
  plugins: [],
};

export default config;
```

### 3.2 Layout Behaviour Per Breakpoint

| Breakpoint | Navigation          | Content Grid        | Notes                                    |
|------------|---------------------|---------------------|------------------------------------------|
| `mobile`   | Bottom tab bar      | 1 column            | Stacked cards, full-width CTAs           |
| `tablet`   | Side drawer (icon)  | 2 columns           | Cards show abbreviated data              |
| `desktop`  | Side nav (expanded) | 2–3 columns         | Full labels, data tables enabled         |
| `wide`     | Side nav (expanded) | 3–4 columns         | Canteen dashboard: KPI tiles + live feed |

### 3.3 Usage Pattern in Components

```tsx
// Example: responsive grid in EmployeeDashboard
<div className="
  grid grid-cols-1
  tablet:grid-cols-2
  desktop:grid-cols-3
  wide:grid-cols-4
  gap-4
">
  {cards.map(card => <DashboardCard key={card.id} {...card} />)}
</div>
```

> [!TIP]
> Always write the mobile style first (no prefix), then layer larger breakpoints on top. Never write desktop-first media queries — it violates Constitution §1.

---

## 4. File & Folder Structure

```
src/
├── assets/                   # Static images, icons
├── components/
│   ├── navigation/
│   │   ├── PortalSwitcher.tsx
│   │   ├── RoleGuard.tsx
│   │   ├── SideNav.tsx
│   │   └── BottomTabBar.tsx
│   ├── leave/
│   ├── food/
│   └── ui/                   # Design-system primitives (Button, Card, Badge…)
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLeaveRequests.ts
│   └── useFoodOrders.ts
├── pages/
│   ├── employee/
│   ├── manager/
│   └── canteen/
├── router/
│   └── index.tsx
├── stores/
│   └── useOrderStore.ts      # Zustand store — single source of truth for FoodOrder.status
├── types/
│   └── index.ts              # All interfaces & enums (§1)
└── utils/
    └── dateUtils.ts          # daysCount calculation, ISO helpers
```

---

## 5. State Management Contract

| Domain            | Store / Hook                     | Mutators                                              | Consumers                               |
|-------------------|----------------------------------|-------------------------------------------------------|-----------------------------------------|
| Auth session      | `AuthContext`                    | `login()`, `logout()`                                 | `RoleGuard`, all layouts                |
| Food orders       | `useOrderStore` (Zustand)        | `placeOrder()`, `updateStatus()`                      | Employee Portal, Canteen Portal         |
| Leave requests    | `useLeaveRequests` (React Query) | `submitLeave()`, `reviewLeave()`                      | Employee Portal, Manager Portal         |
| Leave audit       | `useLeaveAudit` (React Query)    | `auditLeave()` (sets `hrAuditStatus`)                 | HR Portal only                          |
| Attendance logs   | `useAttendance` (React Query)    | `checkIn()`, `checkOut()`, `overrideLog()`, `manualAdd()` | Employee self-service, HR Portal    |
| Portal view       | `PortalSwitcher` local state     | `onSwitch()`                                          | Manager + HR layouts                    |

> [!IMPORTANT]
> `FoodOrder.status` transitions must follow this directed graph:
> `Pending → Preparing → OutForDelivery → Delivered`
> Any attempt to skip a state or go backwards must be rejected by `updateStatus()` with an error.

> [!IMPORTANT]
> `AttendanceLog` mutations via `overrideLog()` or `manualAdd()` are **restricted to `hr_manager` role** and must persist an `AttendanceOverride` sub-document with the HR user's ID, reason, and timestamp. Regular employee check-in/check-out uses `checkIn()` / `checkOut()` only.

---

## 6. Attendance Logic

### 6.1 Check-In / Check-Out Flow

```
Employee taps "Check In"
  → POST /attendance/check-in
  → Creates AttendanceLog { date, checkIn: now(), source: 'System' }

Employee taps "Check Out"
  → POST /attendance/check-out
  → PATCH AttendanceLog { checkOut: now(), durationMinutes: computed }
```

Rules:
- Only **one open log** (no `checkOut`) is allowed per employee per calendar day.
- Attempting to check in twice without checking out first returns a `409 Conflict`.
- `durationMinutes` is computed automatically. A live elapsed timer is displayed on the Employee Dashboard while `isCheckedIn` is true.

### 6.2 Employee Self-Service Attendance History

Employees have access to a dedicated `/employee/attendance` view.
- Displays a table of all personal `AttendanceLog` records.
- Formats timestamps and aggregates the total `durationMinutes` worked per day.

### 6.2 HR Override

An `hr_manager` can correct a log that was missed, wrong, or system-generated incorrectly.

```ts
// useAttendance hook action
function overrideLog(
  logId: string,
  patch: { checkIn?: string; checkOut?: string },
  reason: string
): Promise<AttendanceLog>
```

Behaviour:
1. Snapshot the existing `checkIn` / `checkOut` into `override.originalCheckIn` / `override.originalCheckOut`.
2. Apply the new timestamps.
3. Set `source` to `'Override'`.
4. Persist `override.performedById`, `override.reason`, `override.performedAt`.

> [!CAUTION]
> Override actions are **irreversible** and permanently recorded in `AttendanceOverride`. Show a confirmation modal with the reason field before calling `overrideLog()`.

### 6.3 Manual Add

For cases where a log never existed (e.g. employee forgot to check in entirely):

```ts
function manualAdd(
  employeeId: string,
  date: string,          // YYYY-MM-DD
  checkIn: string,       // ISO 8601
  checkOut: string,      // ISO 8601
  reason: string
): Promise<AttendanceLog>
```

This creates a new `AttendanceLog` with `source: 'Manual'` and an `AttendanceOverride` record.

### 6.4 HR Attendance Views

| View | Route | Description |
|------|-------|-------------|
| Daily Log | `/hr/attendance` | Table of all employees for a selected date. Columns: Name · Check-In · Check-Out · Duration · Source. Filterable by department. |
| Employee History | `/hr/attendance/:employeeId` | Calendar heatmap + log table for one employee. Shows streaks, absences, override history. |
| Trend Summary | `/hr/dashboard` | KPI tiles: Today's check-in rate (%), average hours worked this week, absentee count. |

### 6.5 `AttendanceLog` UI Status Chips

| Source value | Chip label | Chip colour |
|---|---|---|
| `System` | On Time | Green |
| `System` + no checkOut by EOD | Incomplete | Amber |
| `Manual` | Manual Entry | Blue |
| `Override` | HR Override | Purple |
| No log exists | Absent | Red |

---

## 7. HR Leave Audit

### 7.1 Purpose

While department **Managers** approve or reject individual leave requests for their teams, the **HR Manager** performs a company-wide **Final Audit** to:
- Verify that approvals are compliant with policy (leave balance, blackout periods).
- Flag anomalies for further review without reversing the manager's decision.
- Maintain a clean audit trail for compliance and payroll.

> [!NOTE]
> HR audit does **not** override the manager's `LeaveStatus`. It adds a parallel `hrAuditStatus` field (`Unreviewed` → `Confirmed` | `Flagged`). The employee's leave remains `Approved` by the manager.

### 7.2 `useLeaveAudit` Hook Actions

```ts
// src/features/hr/hooks/useLeaveAudit.ts

function auditLeave(
  leaveId: string,
  auditStatus: 'Confirmed' | 'Flagged',
  note?: string               // required when auditStatus === 'Flagged'
): Promise<LeaveRequest>
```

### 7.3 Global Leave Settings

The HR Manager has access to global settings that affect leave calculations company-wide:
- **Exclude Weekends Toggle**: When active, weekends (Saturdays and Sundays) are automatically subtracted from the `daysCount` calculation when an employee requests leave.

### 7.4 Leave Audit Page (`/hr/leave-audit`)

**Filters available:**
- Date range (leave start/end)
- Department
- Leave type
- `hrAuditStatus` — Unreviewed / Confirmed / Flagged
- Manager who approved

**Table columns:**

| Column | Notes |
|--------|-------|
| Employee | Name + avatar |
| Department | |
| Leave Type | Annual / Sick / etc. |
| Period | Start → End, days count |
| Approved By | Manager name |
| Manager Note | `reviewNote` field |
| HR Status | `hrAuditStatus` badge |
| HR Action | Confirm / Flag buttons (only if `Unreviewed`) |

**Summary bar** (sticky above table):
- Total approved leaves in view
- Unreviewed count (with amber alert if > 0)
- Flagged count

### 7.4 Global Leave Trends (`/hr/dashboard` section)

```ts
interface LeaveTrendSummary {
  month: string;                // YYYY-MM
  byType: Record<LeaveType, number>;   // count of approved days per type
  byDepartment: Record<string, number>; // departmentId → approved days
  topAbsentees: { userId: string; days: number }[];
}
```

Rendered as a bar chart (by type, stacked by month) and a department heatmap table. Both are read-only computed views — no mutations.

### 7.5 HR Dashboard KPI Tiles

| Tile | Metric | Colour |
|------|--------|--------|
| Headcount | Total active employees | Neutral |
| Today's Attendance | Check-in rate % (checked-in / headcount) | Green / Amber |
| Open Leave Requests | Pending across all managers | Amber |
| Unreviewed Audits | Approved leaves with `hrAuditStatus: 'Unreviewed'` | Red if > 0 |
| Flagged Records | Leaves with `hrAuditStatus: 'Flagged'` | Red |
