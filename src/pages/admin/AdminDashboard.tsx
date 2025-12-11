import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    completed: 0,
    total: 0,
    revenue: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching dashboard data...");
      
      // 1. Fetch Pickups (for stats & revenue)
      const { data: pickupData, error: pickupError } = await supabase
        .from("pickups")
        .select("status, price");
      
      if (pickupError) {
        console.error("Error fetching pickups:", pickupError);
      } else if (pickupData) {
        setStats({
          pending: pickupData.filter(p => p.status === "pending").length,
          active: pickupData.filter(p => (p.status as string) === "driver_assigned" || (p.status as string) === "picked_up").length,
          completed: pickupData.filter(p => p.status === "completed").length,
          total: pickupData.length,
          revenue: pickupData.reduce((sum, p) => sum + (p.price || 0), 0)
        });
      }

      // 2. Fetch Recent Users
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("full_name, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (userError) {
        console.error("Error fetching users:", userError);
      } else if (userData) {
        setRecentUsers(userData);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { 
      label: "Pending Requests", 
      value: stats.pending, 
      icon: Clock, 
      color: "text-amber-600", 
      bg: "bg-amber-100",
      gradient: "from-amber-500 to-orange-600",
      change: "Needs Action"
    },
    { 
      label: "Active Deliveries", 
      value: stats.active, 
      icon: Truck, 
      color: "text-blue-600", 
      bg: "bg-blue-100",
      gradient: "from-blue-500 to-indigo-600",
      change: "On Route"
    },
    { 
      label: "Completed", 
      value: stats.completed, 
      icon: CheckCircle, 
      color: "text-emerald-600", 
      bg: "bg-emerald-100",
      gradient: "from-emerald-500 to-green-600",
      change: "Lifetime"
    },
    { 
      label: "Total Revenue", 
      value: `$${stats.revenue}`,
      icon: TrendingUp, 
      color: "text-violet-600", 
      bg: "bg-violet-100",
      gradient: "from-violet-500 to-purple-600",
      change: "Real Time"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Welcome back, Admin. Real-time insights from your business.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.gradient}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Manage Pickups</h2>
            <p className="text-blue-200 mb-6 max-w-md">
              You have {stats.pending} pending requests waiting for driver assignment. 
              Assign drivers promptly to ensure customer satisfaction.
            </p>
            <a 
              href="/admin/pickups" 
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-navy font-bold rounded-lg hover:bg-white transition-colors"
            >
              View Pickups Table
            </a>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            New Users
          </h3>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
               <p className="text-sm text-gray-500">No users found.</p>
            ) : (
              recentUsers.map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-bold group-hover:bg-accent group-hover:text-navy transition-colors">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.full_name || "Guest User"}</p>
                    <p className="text-xs text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
