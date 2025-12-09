import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, MapPin, Bell, CreditCard, Lock, Shield, Check, X, Eye, EyeOff } from "lucide-react";
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
  const [initialProfile, setInitialProfile] = useState<null | typeof profile>(null);
  const [address, setAddress] = useState({
    street_address: "",
    city_id: "",
    state: "", // Kept for display purposes
    zip_code: "",
  });
  const [initialAddress, setInitialAddress] = useState<null | typeof address>(null);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<{ id: string; name: string; state: string }[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password Update State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    root?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  const passwordRequirements = [
    { text: "At least 8 characters", met: passwordForm.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(passwordForm.password) },
    { text: "One number", met: /[0-9]/.test(passwordForm.password) },
    { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.password) },
  ];

  // Notification State
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [notifyPrefs, setNotifyPrefs] = useState({
    marketing: true,
    orders: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch cities
      const { data: citiesData } = await supabase
        .from("cities")
        .select("id, name, state")
        .order("name");

      if (citiesData) {
        setAvailableCities(citiesData);
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone, notification_marketing_email, notification_order_email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        const profileInfo = {
          full_name: profileData.full_name || "",
          phone: profileData.phone || "",
        };
        setProfile(profileInfo);
        setInitialProfile(profileInfo);
        
        setNotifyPrefs({
          marketing: profileData.notification_marketing_email ?? true,
          orders: profileData.notification_order_email ?? true,
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
        const city = citiesData?.find(c => c.id === addressData.city_id);
        const addressInfo = {
          street_address: addressData.street_address,
          city_id: addressData.city_id,
          state: city ? city.state : "",
          zip_code: addressData.zip_code,
        };
        setAddress(addressInfo);
        setInitialAddress(addressInfo);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!profile.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
      isValid = false;
    }

    if (profile.phone && profile.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    // Only validate address if any address field is filled (optional update)
    // OR if we assume address is required for functionality. 
    // Let's enforce address requirements if they are trying to save an address.
    const isAddressPartiallyFilled = 
      address.street_address || address.city_id || address.zip_code;

    if (isAddressPartiallyFilled) {
      if (!address.street_address?.trim()) {
        newErrors.street_address = "Street address is required";
        isValid = false;
      }
      if (!address.city_id) {
        newErrors.city = "City is required";
        isValid = false;
      }
      // state is derived
      if (!address.zip_code?.trim()) {
        newErrors.zip_code = "ZIP code is required";
        isValid = false;
      } else if (address.zip_code.length < 5) {
        newErrors.zip_code = "ZIP code must be at least 5 characters";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof passwordErrors = {};
    let isValid = true;
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!passwordRequirements.every((r) => r.met)) {
        newErrors.password = "Password does not meet requirements";
        isValid = false;
    }

    setPasswordErrors(newErrors);
    
    if (!isValid) return;

    setUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.password,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setIsPasswordDialogOpen(false);
      setPasswordForm({ password: "", confirmPassword: "" });
      setPasswordErrors({});
    } catch (error: any) {
      setPasswordErrors({ root: error.message });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleNotifyToggle = async (key: 'marketing' | 'orders', value: boolean) => {
    if (!user) return;
    
    // Optimistic update
    setNotifyPrefs(prev => ({ ...prev, [key]: value }));

    try {
      const updateData = key === 'marketing' 
        ? { notification_marketing_email: value }
        : { notification_order_email: value };

      const { error } = await supabase
        .from("profiles")
        .upsert({
            user_id: user.id,
            ...updateData,
            updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

    } catch (error: any) {
      console.error("Error updating notification prefs:", error);
      // Revert on error
      setNotifyPrefs(prev => ({ ...prev, [key]: !value }));
      toast({
        title: "Error",
        description: error.message || "Failed to update preference.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }

    // Check if changes were made
    const isProfileChanged = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    const isAddressChanged = JSON.stringify(address) !== JSON.stringify(initialAddress);

    if (!isProfileChanged && !isAddressChanged) {
        toast({
            title: "Settings saved",
            description: "No changes were made to your profile.",
        });
        return;
    }

    setSaving(true);

    try {
      // Update profile
      // Upsert profile (create if not exists)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      if (address.street_address && address.city_id && address.zip_code) {
        if (addressId) {
          const { error: addressError } = await supabase
            .from("addresses")
            .update({
              street_address: address.street_address,
              city_id: address.city_id,
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
              city_id: address.city_id,
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
      setInitialProfile(profile);
      setInitialAddress(address);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
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
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
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
                  onChange={(e) => {
                    setProfile({ ...profile, full_name: e.target.value });
                    if (errors.full_name) setErrors({ ...errors, full_name: "" });
                  }}
                  className={`h-11 ${errors.full_name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  value={profile.phone}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    setProfile({ ...profile, phone: numericValue });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={`h-11 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="1234567890"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
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
                onChange={(e) => {
                  setAddress({ ...address, street_address: e.target.value });
                  if (errors.street_address) setErrors({ ...errors, street_address: "" });
                }}
                className={`h-11 ${errors.street_address ? "border-destructive focus-visible:ring-destructive" : ""}`}
                placeholder="123 Main St, Apt 4B"
              />
              {errors.street_address && <p className="text-sm text-destructive">{errors.street_address}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={address.city_id}
                  onValueChange={(value) => {
                    const selectedCity = availableCities.find((c) => c.id === value);
                    setAddress({ 
                      ...address, 
                      city_id: value,
                      state: selectedCity ? selectedCity.state : "" 
                    });
                    if (errors.city) setErrors({ ...errors, city: "" });
                  }}
                >
                  <SelectTrigger className={`h-11 ${errors.city ? "border-destructive focus:ring-destructive" : ""}`}>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={address.state}
                  disabled
                  className="h-11 bg-muted"
                  placeholder="ON"
                />
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={address.zip_code}
                  onChange={(e) => {
                    setAddress({ ...address, zip_code: e.target.value });
                    if (errors.zip_code) setErrors({ ...errors, zip_code: "" });
                  }}
                  className={`h-11 ${errors.zip_code ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="78701"
                />
                {errors.zip_code && <p className="text-sm text-destructive">{errors.zip_code}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
              <DialogTrigger asChild>
                <button className="bg-card rounded-xl border border-border p-6 text-left hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-4">
                    <Bell className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage email preferences.</p>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Email Notifications</DialogTitle>
                  <DialogDescription>
                    Choose which emails you'd like to receive.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="order-emails" className="flex flex-col space-y-1 opacity-70">
                      <span>Order Updates</span>
                      <span className="font-normal text-xs text-muted-foreground">Receive emails about your pickup status (Required).</span>
                    </Label>
                    <Switch
                      id="order-emails"
                      checked={true}
                      disabled
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                      <span>Marketing & Promos</span>
                      <span className="font-normal text-xs text-muted-foreground">Receive news, updates, and special offers.</span>
                    </Label>
                    <Switch
                      id="marketing-emails"
                      checked={notifyPrefs.marketing}
                      onCheckedChange={(checked) => handleNotifyToggle('marketing', checked)}
                    />
                  </div>
                </div>
              </DialogContent>
          </Dialog>

            <button className="bg-card rounded-xl border border-border p-6 text-left hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5 text-navy" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Payment Methods</h3>
              <p className="text-sm text-muted-foreground">Add or update payment cards.</p>
            </button>

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <button className="bg-card rounded-xl border border-border p-6 text-left hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Update Password</h3>
                  <p className="text-sm text-muted-foreground">Change your login password.</p>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Password</DialogTitle>
                  <DialogDescription>
                    Enter your new password below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordUpdate} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.password}
                        onChange={(e) => {
                           setPasswordForm({ ...passwordForm, password: e.target.value });
                           if (passwordErrors.password) setPasswordErrors({ ...passwordErrors, password: undefined });
                        }}
                        className={`pr-10 ${passwordErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.password && <p className="text-sm text-destructive">{passwordErrors.password}</p>}
                    
                    {/* Requirements */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <X className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className={`text-[10px] ${req.met ? "text-green-500" : "text-muted-foreground"}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                         setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                         if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                      }}
                      className={passwordErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {passwordErrors.confirmPassword && <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>}
                  </div>

                  {passwordErrors.root && (
                    <p className="text-sm text-destructive text-center">{passwordErrors.root}</p>
                  )}

                  <div className="flex justify-end mt-4">
                    <Button type="submit" variant="navy" disabled={updatingPassword}>
                      {updatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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
