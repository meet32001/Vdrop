import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, LogOut, Package, 
  ChevronRight, Bell, Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link to={to}>
      <Button
        variant="ghost"
        className={`w-full justify-start gap-3 px-4 py-6 transition-all duration-200 ${
          isActive(to) 
            ? "bg-white/10 text-white shadow-sm border-l-4 border-accent rounded-r-lg rounded-l-none" 
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive(to) ? "text-accent" : ""}`} />
        <span className="font-medium">{label}</span>
        {isActive(to) && <ChevronRight className="w-4 h-4 ml-auto text-white/40" />}
      </Button>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] text-white hidden md:flex flex-col shadow-xl z-20">
        {/* Brand */}
        <div className="p-8 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none">Vdrop</h1>
              <span className="text-xs text-blue-200 font-medium tracking-wider uppercase">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 mt-2">Main Menu</p>
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/pickups" icon={Package} label="Pickups" />
          <NavItem to="/admin/users" icon={Users} label="Customers" />
        </nav>

        {/* User Profile */}
        <div className="p-4 m-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-accent/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="text-white/40 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900 capitalize">
              {location.pathname.split("/").pop() || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-8 w-px bg-gray-200"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
