import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Package, MapPin, Calendar, Camera, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Pickup {
  id: string;
  created_at: string;
  pickup_date: string;
  pickup_time: string;
  status: string;
  service_type: "standard" | "premium";
  pickup_address: string;
  pickup_zip: string;
  number_of_boxes: number | null;
  item_size: string | null;
  dropoff_photo_url: string | null;
}

const History = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickups = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("pickups")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setPickups(data as Pickup[]);
      }
      setLoading(false);
    };

    fetchPickups();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-navy/30 border-t-navy rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pickup History</h1>
          <p className="text-muted-foreground">View all your past pickups and receipts.</p>
        </div>

        {/* Pickups List */}
        {pickups.length > 0 ? (
          <div className="space-y-4">
            {pickups.map((pickup) => (
              <div
                key={pickup.id}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    {/* Icon & Type */}
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        pickup.service_type === "premium" ? "bg-accent/10" : "bg-navy/10"
                      )}>
                        {pickup.service_type === "premium" ? (
                          <Sparkles className="w-6 h-6 text-accent" />
                        ) : (
                          <Package className="w-6 h-6 text-navy" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground capitalize">
                            {pickup.service_type} Vdrop
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            pickup.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-accent/10 text-accent"
                          }`}>
                            {pickup.status === "completed" ? "Completed" : pickup.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pickup.service_type === "premium"
                            ? `${pickup.item_size || "Medium"} item`
                            : `${pickup.number_of_boxes || 1} ${(pickup.number_of_boxes || 1) === 1 ? "box" : "boxes"}`}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {pickup.pickup_address}, {pickup.pickup_zip}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(pickup.pickup_date), "MMM d, yyyy")} at {pickup.pickup_time}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {pickup.dropoff_photo_url && (
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4" />
                          View Photo
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order ID Footer */}
                <div className="px-6 py-3 bg-secondary/30 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Order ID: <span className="font-mono font-medium text-foreground">{pickup.id.slice(0, 8).toUpperCase()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No pickups yet</h3>
            <p className="text-muted-foreground text-sm">
              Your pickup history will appear here once you book your first return.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
