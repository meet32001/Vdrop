import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-dark text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-navy font-bold text-xl">V</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Vdrop Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                isActive("/admin") 
                  ? "bg-accent text-navy hover:bg-accent/90 hover:text-navy" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Button>
          </Link>
          
          <Link to="/admin/pickups">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                isActive("/admin/pickups") 
                  ? "bg-accent text-navy hover:bg-accent/90 hover:text-navy" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Package className="w-5 h-5" />
              All Pickups
            </Button>
          </Link>

          <Link to="/admin/users">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                isActive("/admin/users") 
                  ? "bg-accent text-navy hover:bg-accent/90 hover:text-navy" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className="w-5 h-5" />
              Users
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
