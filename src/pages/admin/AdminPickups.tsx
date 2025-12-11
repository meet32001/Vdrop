import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  Package, Search, Filter, Download, 
  MoreHorizontal, Truck, CheckCircle, Clock, MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AdminPickup {
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
  label_file_url: string | null;
  user_id: string;
  profiles: {
    full_name: string | null;
    phone: string | null;
    email: string | null; // Note: Email is in auth.users, getting it via profile might require a trigger. 
                          // For now we'll rely on phone/name or fetch email if profile has it.
                          // Actually profiles usually just has name/phone in this schema.
  };
}

const AdminPickups = () => {
  const [pickups, setPickups] = useState<AdminPickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchPickups = async () => {
    setLoading(true);
    
    // 1. Fetch Pickups
    const { data: pickupsData, error: pickupsError } = await supabase
      .from("pickups")
      .select("*")
      .order("created_at", { ascending: false });

    if (pickupsError) {
      toast.error("Failed to fetch pickups");
      console.error(pickupsError);
      setLoading(false);
      return;
    }

    if (!pickupsData || pickupsData.length === 0) {
      setPickups([]);
      setLoading(false);
      return;
    }

    // 2. Fetch Profiles for these users
    const userIds = Array.from(new Set(pickupsData.map(p => p.user_id)));
    
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name, phone")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      // Continue anyway, just without names
    }

    // 3. Merge Data
    const mergedData = pickupsData.map(pickup => {
      const profile = profilesData?.find(p => p.user_id === pickup.user_id);
      return {
        ...pickup,
        profiles: {
          full_name: profile?.full_name || null,
          phone: profile?.phone || null,
          email: null
        }
      };
    });

    setPickups(mergedData as AdminPickup[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setPickups(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    toast.success(`Status updated to ${newStatus.replace("_", " ")}`);

    const { error } = await supabase
      .from("pickups")
      .update({ status: newStatus as any })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status in DB");
      fetchPickups(); // Revert
    }
  };

  const filteredPickups = pickups.filter(pickup => {
    const matchesSearch = 
      pickup.pickup_address.toLowerCase().includes(search.toLowerCase()) ||
      pickup.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      pickup.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || pickup.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "driver_assigned": return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked_up": return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Manage Pickups</h1>
          <p className="text-muted-foreground">View and manage all customer pickup requests</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={fetchPickups} className="gap-2">
             Refresh
           </Button>
           <Button variant="default" className="bg-navy hover:bg-navy-light gap-2">
             <Download className="w-4 h-4" />
             Export CSV
           </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by ID, Address, or Name..." 
            className="pl-10 border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="driver_assigned">Driver Assigned</option>
            <option value="picked_up">Picked Up</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                   Loading pickups...
                 </TableCell>
               </TableRow>
            ) : filteredPickups.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                   No pickups found matching your filters.
                 </TableCell>
               </TableRow>
            ) : (
              filteredPickups.map((pickup) => (
                <TableRow key={pickup.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{format(new Date(pickup.pickup_date), "MMM d, yyyy")}</span>
                      <span className="text-xs text-muted-foreground">{pickup.pickup_time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-navy">{pickup.profiles?.full_name || "Guest User"}</span>
                      <span className="text-xs text-muted-foreground">{pickup.profiles?.phone || "No phone"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1.5 max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-sm truncate">{pickup.pickup_address}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-5">{pickup.pickup_zip}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pickup.service_type === "premium" ? "default" : "secondary"} className={
                      pickup.service_type === "premium" ? "bg-accent text-navy hover:bg-accent/80" : ""
                    }>
                      {pickup.service_type === "premium" && <Package className="w-3 h-3 mr-1" />}
                      {pickup.service_type}
                    </Badge>
                    {pickup.label_file_url && (
                       <Button 
                         variant="link" 
                         size="sm" 
                         className="h-auto p-0 text-xs block text-blue-600 mt-1"
                         onClick={() => window.open(pickup.label_file_url!, "_blank")}
                       >
                         View Label
                       </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(pickup.status)}`}>
                      {pickup.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateStatus(pickup.id, "pending")}>
                          <Clock className="mr-2 h-4 w-4" /> Mark Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(pickup.id, "driver_assigned")}>
                          <Truck className="mr-2 h-4 w-4" /> Assign Driver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(pickup.id, "picked_up")}>
                          <Package className="mr-2 h-4 w-4" /> Mark Picked Up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(pickup.id, "completed")}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPickups;
