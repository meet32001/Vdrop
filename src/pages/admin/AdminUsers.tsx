import { useEffect, useState } from "react";
import { 
  Users, Search, Filter, MoreHorizontal, 
  Trash2, Edit, Shield, Mail, Phone 
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role: "admin" | "driver" | "customer";
  email?: string; // We will try to fetch/map this if possible, or use placeholder logic
}

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Invite State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteData, setInviteData] = useState({
    email: "",
    full_name: "",
    role: "customer"
  });

  // Edit State
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>("");

  // Edit Form State (for Name/Phone/Role)
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    phone: "",
    role: ""
  });

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch only users who are NOT deleted
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      // We use .is("deleted_at", null) to filter out soft-deleted users
      // Note: If you haven't added the column yet, this filter might be ignored or error.
      // Assuming 'deleted_at' migration is applied.
      .is("deleted_at", null) 
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } else {
      setUsers(data as any[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditRole = (user: Profile) => {
    setEditingUser(user);
    setEditFormData({
      full_name: user.full_name || "",
      phone: user.phone || "",
      role: user.role || "customer"
    });
    setIsEditDialogOpen(true);
  };

  const saveUserChanges = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from("profiles")
      .update({ 
        role: editFormData.role,
        full_name: editFormData.full_name,
        phone: editFormData.phone
      } as any)
      .eq("id", editingUser.id);

    if (error) {
      toast.error("Failed to update user");
    } else {
      toast.success("User updated successfully");
      setUsers(users.map(u => 
        u.id === editingUser.id ? { 
          ...u, 
          role: editFormData.role as any,
          full_name: editFormData.full_name,
          phone: editFormData.phone
        } : u
      ));
      setIsEditDialogOpen(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteData.email) return toast.error("Email is required");

    setInviteLoading(true);
    try {
      // Direct fetch to debug the 400 error body
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch("https://iojloxzntfkukzdctrev.supabase.co/functions/v1/clever-function", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({
          ...inviteData,
          invite_url: window.location.origin // Sends 'http://localhost:8080' (or production URL)
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Function returned error");
      }
      
      console.log("Invite success:", responseData);
      toast.success("Invitation sent successfully!");
      setIsInviteOpen(false);
      setInviteData({ email: "", full_name: "", role: "customer" });
      fetchUsers(); 
    } catch (error: any) {
      let msg = error.message || "Failed to invite user";
      
      // Handle "Already Registered" specific case
      if (msg.includes("already")) {
        setInviteError("User already exists with this email.");
        // Do NOT show toast or console error for this specific case as requested
      } else {
        // For other real errors, show toast and log
        console.error("Invite Error Details:", error);
        toast.error(`Error: ${msg}`);
      }
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user? They will no longer appear in this list.")) return;

    // Soft Delete: Set deleted_at timestamp
    const { error } = await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to deactivate user");
      console.error(error);
    } else {
      toast.success("User deactivated (Soft Delete)");
      setUsers(users.filter(u => u.user_id !== userId));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (user.phone?.toLowerCase() || "").includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">User Management</h1>
          <p className="text-muted-foreground">Manage roles, permissions, and user accounts</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={fetchUsers} className="gap-2">
             Refresh List
           </Button>
           <Button onClick={() => setIsInviteOpen(true)} className="gap-2 bg-navy hover:bg-navy-light">
             <Mail className="w-4 h-4" />
             Invite User
           </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by Name or Phone..." 
            className="pl-10 border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead>User Details</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow>
                 <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                   Loading users...
                 </TableCell>
               </TableRow>
            ) : filteredUsers.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                   No users found.
                 </TableCell>
               </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-sm">
                        {user.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-navy">{user.full_name || "Guest User"}</span>
                        <span className="text-xs text-muted-foreground font-mono">ID: {user.user_id.slice(0, 6)}...</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Mail className="w-3.5 h-3.5 text-gray-400" />
                         <span className="text-xs opacity-50 italic">Stored in Auth</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      capitalize font-medium
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                      ${user.role === 'driver' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                      ${user.role === 'customer' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                    `}>
                      {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role || 'customer'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditRole(user)}>
                          <Edit className="mr-2 h-4 w-4" /> Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.user_id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete User
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

      {/* Invite User Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={(open) => {
        setIsInviteOpen(open);
        if (!open) setInviteError(""); // Clear error on close
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation email to a new user. They will receive a link to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                placeholder="colleague@vdrop.com" 
                value={inviteData.email}
                onChange={(e) => {
                  setInviteData({ ...inviteData, email: e.target.value });
                  setInviteError(""); // Clear error on typing
                }}
                className={inviteError ? "border-red-500" : ""}
              />
              {inviteError && (
                 <p className="text-xs text-red-500 font-medium">{inviteError}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                placeholder="John Doe" 
                value={inviteData.full_name}
                onChange={(e) => setInviteData({ ...inviteData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select 
                value={inviteData.role} 
                onValueChange={(val) => setInviteData({ ...inviteData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInviteUser} disabled={inviteLoading}>
              {inviteLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update details for <b>{editingUser?.full_name}</b>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                value={editFormData.full_name}
                onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select 
                value={editFormData.role} 
                onValueChange={(val) => setEditFormData({ ...editFormData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {editFormData.role === 'admin' && (
                <p className="text-xs text-red-500 mt-1">
                  Warning: Admins have full access to the platform.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveUserChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
