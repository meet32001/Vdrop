# 📦 Vdrop - Return Pickups Made Easy

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Stack](https://img.shields.io/badge/stack-React_Values-orange.svg)

**Vdrop** is a modern web application designed to simplify the package return process. Users can schedule door-to-door pickups for their returns, eliminating the need to visit post offices or drop-off points.

---

## 🚀 Key Features

*   **📅 Easy Booking**: Schedule pickups with a few clicks, choosing convenient dates and times.
*   **🏢 Address Management**: Save and manage detailed pickup addresses.
*   **🛡️ Role-Based Access Control (RBAC)**: Secure Admin and Customer panels with performant Metadata Sync logic.
*   **🔒 Enhanced Security**: Database triggers prevents privilege escalation hacks and unauthorized role changes.
*   **⚙️ Smart Configuration**: Environment-based Admin Allowlist and dynamic role management.
*   **📊 User Dashboard**: Track pickup status (Pending, Completed, Cancelled) in real-time.
*   **📧 Notifications**: Automated email confirmations for bookings and admin alerts (powered by Supabase Edge Functions).
*   **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop experiences.
*   **🏷️ Label Upload**: Securely upload shipping labels (PDF/Images) directly to the cloud.

---

## 🛠️ Technology Stack

*   **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **Backend / Auth**: [Supabase](https://supabase.com/) (Auth, Database, Storage, Edge Functions)
*   **State Management**: [TanStack Query](https://tanstack.com/query/latest)
*   **Email**: Gmail SMTP via Supabase Edge Functions (Deno)

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A [Supabase](https://supabase.com) project

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/vdrop.git
    cd vdrop
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🗄️ Database Schema

The project uses Supabase (PostgreSQL) with the following core tables:

*   `profiles`: User details (linked to Auth).
*   `addresses`: Saved pickup locations.
*   `pickups`: Main booking records (Date, Time, Status, Service Type).
*   `storage/return-labels`: Bucket for user-uploaded return labels.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the Vdrop Team
</p>