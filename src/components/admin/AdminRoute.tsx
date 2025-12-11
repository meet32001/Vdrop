import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Hardcoded for MVP security. 
// In production, you might want to move this to an Env Var or a database 'role' column.
const ADMIN_EMAILS = [
  "20bmiit066@gmail.com",
  "meet30012002@gmail.com", // Adding potential personal email just in case, based on user history
  "hello@vdrop.ca"
];

const AdminRoute = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && !ADMIN_EMAILS.includes(user.email || "")) {
      toast.error("Access Denied. Admin only.");
    }
  }, [user, loading]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
