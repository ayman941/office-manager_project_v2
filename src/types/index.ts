// src/types/index.ts

export type UserRole = 'employee' | 'manager' | 'canteen' | 'hr_manager';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

/**
 * HR-level audit status applied on top of the manager's decision.
 * Sits separately from LeaveStatus so manager workflow is unchanged.
 */
export type LeaveAuditStatus = 'Unreviewed' | 'Confirmed' | 'Flagged';

export type LeaveType = 'Annual' | 'Sick' | 'Unpaid' | 'Maternity' | 'Paternity' | 'Other';

export type FoodOrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled';

export type AttendanceLogSource = 'System' | 'Manual' | 'Override';

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

export interface LeaveRequest {
  id: string;                  // UUID
  requestedById: string;       // → User.id
  reviewedById?: string;       // → User.id (manager); null while Pending
  type: LeaveType;
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
