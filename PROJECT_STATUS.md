# Project Status & Backend Roadmap

## 1. Frontend Status Audit

The frontend is **visually complete** and structured correctly. The design is implemented (Premium Navy/Orange theme), and the core user flows exist.

| Page | Status | functionality Gaps |
| :--- | :--- | :--- |
| **Landing (`/`)** | ✅ Complete | None. Visuals and routing work. |
| **Authentication (`/login`, `/signup`)** | ⚠️ Partial | UI is ready. Needs real Supabase Auth connection (currently uses placeholders). |
| **Dashboard (`/dashboard`)** | ⚠️ Partial | Grid layout exists. Needs to fetch **real pickup stats** from the database. |
| **Book Pickup (`/book`)** | ⚠️ Partial | Form works. Needs to **upload PDF labels** to Storage and **insert rows** into `pickups` table. |
| **History (`/history`)** | ⚠️ Partial | UI exists. Needs to fetch **list of pickups** from `pickups` table. |
| **Settings (`/settings`)** | ⚠️ Partial | Form exists. Needs to sync `profiles` (name/phone) and `addresses` tables. |

---

## 2. Backend Architecture (Supabase)

Your current type definitions (`types.ts`) show a solid schema is already planned.

### Database Tables (Required)
1.  **`profiles`**: Extends the default user object.
    *   Fields: `id` (FK to auth.users), `full_name`, `phone`.
2.  **`addresses`**: Stores user pickup locations.
    *   Fields: `user_id`, `street_address`, `city`, `state`, `zip_code`, `is_default`.
3.  **`pickups`**: The core logic table.
    *   Fields: `user_id`, `service_type` (standard/premium), `status` (pending/picked_up/etc), `pickup_date`, `pickup_time`, `label_file_url`.

### Storage
*   **Bucket**: `return-labels`
*   **Purpose**: Stores the PDF files uploaded during "Premium" booking.
*   **Security**: Restricted so users can only upload/read their own files.

### Security (Row Level Security - RLS)
*   We must enable RLS on all changes.
*   **Policy**: "Users can only select/insert/update their own data" (`auth.uid() == user_id`).

---

## 3. Direction Needed (Critical Definitions)

To finalize the backend, I need direction on these business logic flows:

### A. Payment Integration
*   **Current State**: The "Book Pickup" button says "Confirm & Pay", but there is no payment processor.
*   **Question**: Do you want to **integrate Stripe** now, or keep it as a "Mock Payment" (click -> success) for the MVP?

### B. Admin/Driver View
*   **Current State**: Users can create pickups, but nobody sees them.
*   **Question**: Do you need a simple **Admin Page** for you/drivers to view the request list and change the status (e.g., from "Pending" to "Picked Up")?

### C. Notifications
*   **Current State**: No emails are sent.
*   **Question**: Do you want Supabase to send a **confirmation email** upon booking? (Requires an email provider service).

---

## 4. Implementation Steps (Roadmap)

1.  **Phase 1: Database Setup** (I can do this providing SQL scripts).
    *   Create `profiles`, `addresses`, `pickups` tables.
    *   Create `return-labels` storage bucket.
2.  **Phase 2: Authentication Wiring**
    *   Connect Signup form to auto-create `profiles` entry.
3.  **Phase 3: Core Feature - Booking**
    *   Wire "Book Pickup" form to upload PDF -> save to Storage -> insert `pickup` record.
4.  **Phase 4: Dashboard Wiring**
    *   Connect Dashboard/History pages to `useQuery` fetching from Supabase.
