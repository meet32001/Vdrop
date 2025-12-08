import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Package, PlusCircle, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Pickup {
  id: string;
  created_at: string;
  status: string;
  service_type: string;
  pickup_address: string;
}

interface Profile {
  full_name: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentPickups, setRecentPickups] = useState<Pickup[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfile(profileData);

      // Fetch pickups
      const { data: pickupsData } = await supabase
        .from("pickups")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (pickupsData) {
        setRecentPickups(pickupsData.slice(0, 3));
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        setStats({
          total: pickupsData.length,
          thisMonth: pickupsData.filter(p => new Date(p.created_at) >= startOfMonth).length,
          completed: pickupsData.filter(p => p.status === "completed").length,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const statCards = [
    { label: "Total Pickups", value: stats.total.toString(), icon: Package, color: "bg-navy/10 text-navy" },
    { label: "This Month", value: stats.thisMonth.toString(), icon: Clock, color: "bg-accent/10 text-accent" },
    { label: "Completed", value: stats.completed.toString(), icon: CheckCircle, color: "bg-green-100 text-green-600" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground">Ready to drop off some returns?</p>
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-br from-navy to-navy-dark rounded-2xl p-6 lg:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                Need to return something?
              </h2>
              <p className="text-primary-foreground/70">
                Book a pickup in under 2 minutes. We'll handle the rest.
              </p>
            </div>
            <Link to="/dashboard/book">
              <Button variant="accent" size="lg" className="whitespace-nowrap">
                <PlusCircle className="w-5 h-5" />
                Book a Pickup
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-6 shadow-card border border-border"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Pickups */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Pickups</h3>
            <Link
              to="/dashboard/history"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="w-8 h-8 border-4 border-navy/30 border-t-navy rounded-full animate-spin mx-auto" />
            </div>
          ) : recentPickups.length > 0 ? (
            <div className="divide-y divide-border">
              {recentPickups.map((pickup) => (
                <div key={pickup.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground capitalize">
                        {pickup.service_type} Vdrop
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        pickup.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-accent/10 text-accent"
                      }`}>
                        {pickup.status === "completed" ? "Completed" : pickup.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{pickup.pickup_address}</p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(pickup.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">No pickups yet</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Book your first pickup to get started!
              </p>
              <Link to="/dashboard/book">
                <Button variant="accent" size="sm">
                  <PlusCircle className="w-4 h-4" />
                  Book a Pickup
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
