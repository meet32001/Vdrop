import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// MVP Security: Using Env Var for Super Admins
// For production, this allows changing admins without redeploying code if using env vars
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map((e: string) => e.trim());

const AdminRoute = () => {
  const { user, loading, role } = useAuth(); // Use role from metadata

  useEffect(() => {
    // If NOT loading, User exists
    if (!loading && user) {
      // Permission Check: Must be Admin OR Driver OR in the Env Allowlist
      const isAllowed = (role === 'admin') || (role === 'driver') || ADMIN_EMAILS.includes(user.email || "");
      
      if (!isAllowed) {
        toast.error("Access Denied. Admin permissions required.");
      }
    }
  }, [user, loading, role]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  // Permission Check Logic again for rendering
  const isAllowed = user && ((role === 'admin') || (role === 'driver') || ADMIN_EMAILS.includes(user.email || ""));

  if (!isAllowed) {
    // Redirect to login if no user, or dashboard if unauthorized user
    return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
