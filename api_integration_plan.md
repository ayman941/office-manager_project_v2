# API Integration Plan — Smart Office Manager

This document outlines the design and integration plan for connecting the Smart Office frontend application to the Django-based backend API (`https://smart-office-backend-production.up.railway.app/api`).

---

## 1. Architectural Approach & Best Practices

We will adopt a **Store-Driven Integration** strategy to maintain clean boundaries between UI and data fetching:
* **Centralized API Client**: Continue using the configured [apiClient.ts](file:///d:/office-manager_project_v2-main/office-manager_project_v2-main/src/lib/apiClient.ts) which handles automatic Bearer token injection, token refresh interceptors, and error handling.
* **Encapsulated State**: Keep API mutations and fetches inside dedicated Zustand stores or React hooks. This prevents page components from having inline fetch calls.
* **Type Safety**: Maintain strict TypeScript interfaces matching the backend serializer models (updated in `src/types/index.ts`).
* **Optimistic Updates**: For critical actions (e.g. check-in/out, food cart changes), update the UI state immediately and rollback if the server returns an error.

---

## 2. API Endpoint Mapping

| Feature Domain | Django API Endpoint | HTTP Method | Frontend Consumer / Store | Purpose |
|---|---|---|---|---|
| **Auth** | `/api/token/` | `POST` | `AuthContext` | User authentication & JWT generation |
| **Auth** | `/api/token/refresh/` | `POST` | `apiClient` interceptor | Silent token refreshing |
| **Profile** | `/api/employees/me/` | `GET` | `AuthContext` | Retrieve authenticated user's profile |
| **Directory** | `/api/employees/` | `GET` / `POST` | `useEmployeeStore` | List/Create employee profiles (HR) |
| **Directory** | `/api/employees/{id}/` | `GET`/`PUT`/`PATCH` | `useEmployeeStore` | Retrieve/Update employee profiles |
| **Directory** | `/api/departments/` | `GET` | `useEmployeeStore` | Populate departments in forms |
| **Directory** | `/api/locations/` | `GET` | `useEmployeeStore` | Populate office locations/wifi MACs |
| **Attendance**| `/api/attendance/` | `GET` | `useAttendanceStore` | List logs (scoped automatically by backend role) |
| **Attendance**| `/api/attendance/checkin/` | `POST` | `useAttendanceStore` | Log daily check-in (System source) |
| **Attendance**| `/api/attendance/checkout/` | `POST` | `useAttendanceStore` | Log daily check-out (System source) |
| **Attendance**| `/api/attendance/today_status/` | `GET` | `useAttendanceStore` | Fetch today's check-in status |
| **Leaves** | `/api/leave-balances/` | `GET` | `useLeaveStore` | Fetch personal or company leave balances |
| **Leaves** | `/api/leave-requests/` | `GET` / `POST` | `useLeaveStore` | View leaves list / Submit leave request |
| **Leaves** | `/api/leave-requests/{id}/approve/` | `POST` | `useLeaveStore` | Approve request (Manager / HR) |
| **Leaves** | `/api/leave-requests/{id}/reject/` | `POST` | `useLeaveStore` | Reject request (Manager / HR) |
| **Canteen** | `/api/menu-items/` | `GET` / `POST` | `useMenuStore` | View buffet menu / Admin edit menu |
| **Canteen** | `/api/orders/` | `GET` | `useOrderStore` | List employee or company-wide orders |
| **Canteen** | `/api/orders/place_order/` | `POST` | `useOrderStore` | Submit new order with nested order items |
| **Canteen** | `/api/orders/{id}/update_status/` | `POST` | `useOrderStore` | Update order prep/delivery status |

---

## 3. Phased Implementation Plan

### Phase 1: Core Directories & Auth Cleanup
* Clean up the remaining mock users from local views, changing components that import `SEED_USERS` to fetch from `useEmployeeStore`.
* Create `useEmployeeStore` to fetch employees from `/api/employees/` and departments from `/api/departments/`.

### Phase 2: Attendance System Integration
* Replace memory-only check-in/out inside `useAttendanceStore` with calls to `/api/attendance/checkin/` and `/api/attendance/checkout/`.
* Integrate `/api/attendance/today_status/` to determine the dashboard's initial state on mount.

### Phase 3: Leave Request & Balance Integration
* Connect `useLeaveStore` to `/api/leave-requests/` and `/api/leave-balances/`.
* Sync manager approvals/rejections with `/api/leave-requests/{id}/approve/` and `/api/leave-requests/{id}/reject/`.

### Phase 4: Food Ordering & Canteen Staff Portals
* Connect menu list to `/api/menu-items/`.
* Connect order placements to `/api/orders/place_order/` and status tracking to `/api/orders/{id}/update_status/`.

---

## 4. Code Patterns & Examples

### Example: Syncing Attendance Store
```typescript
// src/stores/useAttendanceStore.ts
import { create } from 'zustand'
import apiClient from '@/lib/apiClient'
import type { AttendanceLog } from '@/types'

interface AttendanceState {
  logs: AttendanceLog[]
  todayStatus: AttendanceLog | null
  isLoading: boolean
  fetchTodayStatus: () => Promise<void>
  fetchLogs: () => Promise<void>
  checkIn: () => Promise<void>
  checkOut: () => Promise<void>
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  logs: [],
  todayStatus: null,
  isLoading: false,

  async fetchTodayStatus() {
    try {
      const { data } = await apiClient.get('/attendance/today_status/')
      set({ todayStatus: data })
    } catch {
      set({ todayStatus: null })
    }
  },

  async fetchLogs() {
    set({ isLoading: true })
    try {
      const { data } = await apiClient.get('/attendance/')
      set({ logs: data })
    } finally {
      set({ isLoading: false })
    }
  },

  async checkIn() {
    const { data } = await apiClient.post('/attendance/checkin/', {})
    set((state) => ({
      todayStatus: data,
      logs: [data, ...state.logs]
    }))
  },

  async checkOut() {
    const { data } = await apiClient.post('/attendance/checkout/', {})
    set((state) => ({
      todayStatus: data,
      logs: state.logs.map(log => log.id === data.id ? data : log)
    }))
  }
}))
```
