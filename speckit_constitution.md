# Smart Office Project Constitution

## 1. Core Architectural Principles
* **Framework:** React 18+ (Vite) with TypeScript (Strict Mode).
* **CSS Strategy:** Tailwind CSS for layout and utility, mapped to Stitch design tokens.
* **State Management:**
    * **AuthContext:** Centralized session handling (Login/Logout/Roles).
    * **Zustand or Context API:** Lightweight stores for Food Orders and Attendance statuses.
* **Clean Code:** Follow the Repository Pattern for API calls and Service/Logic separation for business rules.

## 2. Design System & UI Parity (Stitch Standards)
* **Zero Defaults:** No standard HTML elements or default Tailwind colors. All styles must reference the provided UI blueprints and screenshots.
* **Color Palette (Stitch Hex Codes):**
    * **Primary/Action:** `#0E5E6F` (Deep Teal - Primary buttons, Sidebars, Active states).
    * **Secondary/Soft:** `#FFD1BB` (Soft Coral - Accents, Sick Leave background).
    * **Success/Status:** `#00C1A3` (Check-in Status, Progress bars).
    * **Background:** `#F2F5F8` (Soft Light Gray/Blue background tint).
    * **Critical:** `#B43219` (Inventory alerts, Rejection states).
* **Typography:** Primary font is "Inter" or "Instrument Sans". Titles use `font-semibold`.
* **Iconography:** Use **Lucide-React** or **Phosphor Icons** (Thin line style, 1.5px stroke).
* **Components:** 16px border-radius on cards, 0 4px 20px rgba(0,0,0,0.05) soft shadows.

## 3. Responsive & Mobile-First Strategy
* **The "375 Rule":** Every feature must be functional and visually identical to the blueprint at 375px width first.
* **Navigation Patterns:**
    * **Mobile (< 768px):** Fixed Bottom Navigation Bar (Home, Food, Orders, Leave, Menu).
    * **Desktop (> 768px):** Fixed Left-hand Sidebar with User Profile and Role-specific links.
* **Adaptive Layouts:**
    * **HR/Canteen Tables:** Must collapse into "Card Lists" on mobile.
    * **Dashboard:** Grid columns must drop from 3 or 4 to a single column on small screens.

## 4. Role-Based Requirements & Views
* **Employee:** Personal dashboard, "Check In/Out" toggle, Food menu with category filtering, and the visual "Order Tracking" map.
* **Manager (Team Lead):** A dedicated "Leave Requests" review portal with Approve/Reject card actions.
* **HR Manager:** "HR Authority" portal featuring real-time attendance charts (94% display), full Employee Directory, and Audit Logs.
* **Canteen Staff:** "Orders Dashboard" with Incoming/Preparing/Out-for-Delivery columns and "Core Inventory" tracking.

## 5. Session & Interaction Logic
* **Auth & Logout:** Global session management. The top-right profile icon must trigger a dropdown containing a "Logout" action.
* **Real-Time Feedback:** Buttons must reflect status changes immediately (e.g., "Start Prep" moves a card to "Preparing").
* **Inventory Logic:** Progress bars for stock levels (e.g., 42/150 units) must dynamically change color to Red when below 25%.

---

### Implementation Instructions for Agents:
> **Agents:** You are strictly forbidden from using 'Coming Soon' placeholders. If a view is missing in the current build but exists in the blueprints or provided screenshots, you must implement it fully with mock data. Always prioritize the **Mobile-First** approach—if a screen works on desktop but breaks on mobile, the task is incomplete.
