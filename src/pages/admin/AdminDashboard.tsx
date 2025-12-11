import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from("pickups").select("status");
      
      if (data) {
        setStats({
          pending: data.filter(p => p.status === "pending").length,
          active: data.filter(p => (p.status as string) === "driver_assigned" || (p.status as string) === "picked_up").length,
          completed: data.filter(p => p.status === "completed").length,
          total: data.length
        });
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Active", value: stats.active, icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total", value: stats.total, icon: Package, color: "text-navy", bg: "bg-navy/10" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
