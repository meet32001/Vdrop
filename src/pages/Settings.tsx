import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Bell, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
  });
  const [address, setAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [addressId, setAddressId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          phone: profileData.phone || "",
        });
      }

      // Fetch default address
      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .maybeSingle();

      if (addressData) {
        setAddressId(addressData.id);
        setAddress({
          street_address: addressData.street_address,
          city: addressData.city,
          state: addressData.state,
          zip_code: addressData.zip_code,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Update or create default address
      if (address.street_address && address.city && address.state && address.zip_code) {
        if (addressId) {
          const { error: addressError } = await supabase
            .from("addresses")
            .update({
              street_address: address.street_address,
              city: address.city,
              state: address.state,
              zip_code: address.zip_code,
            })
            .eq("id", addressId);

          if (addressError) throw addressError;
        } else {
          const { error: addressError } = await supabase
            .from("addresses")
            .insert({
              user_id: user.id,
              street_address: address.street_address,
              city: address.city,
              state: address.state,
              zip_code: address.zip_code,
              is_default: true,
            });

          if (addressError) throw addressError;
        }
      }

      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
      <div className="p-6 lg:p-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-card rounded-xl border border-border p-6 lg:p-8 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
              <User className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Update your personal details.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="h-11"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="h-11 bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Default Address Section */}
        <div className="bg-card rounded-xl border border-border p-6 lg:p-8 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Default Pickup Address</h2>
              <p className="text-sm text-muted-foreground">Your primary address for pickups.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={address.street_address}
                onChange={(e) => setAddress({ ...address, street_address: e.target.value })}
                className="h-11"
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="h-11"
                  placeholder="Austin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="h-11"
                  placeholder="TX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={address.zip_code}
                  onChange={(e) => setAddress({ ...address, zip_code: e.target.value })}
                  className="h-11"
                  placeholder="78701"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button className="bg-card rounded-xl border border-border p-6 text-left hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-4">
              <Bell className="w-5 h-5 text-navy" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Notifications</h3>
            <p className="text-sm text-muted-foreground">Manage email and SMS alerts.</p>
          </button>

          <button className="bg-card rounded-xl border border-border p-6 text-left hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5 text-navy" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">Add or update payment cards.</p>
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="navy" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
