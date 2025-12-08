import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Sparkles,
  Upload,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type ServiceType = "standard" | "premium";

const BookPickup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>("premium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Standard fields
    numberOfBoxes: "1",
    // Premium fields
    itemSize: "",
    labelFile: null as File | null,
    // Common fields
    address: "",
    apartment: "",
    city: "Austin",
    state: "TX",
    zip: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
  });

  const steps = [
    { number: 1, title: "Service", icon: Package },
    { number: 2, title: "Details", icon: FileText },
    { number: 3, title: "Address", icon: MapPin },
    { number: 4, title: "Confirm", icon: Check },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setFormData({ ...formData, labelFile: file });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, labelFile: null });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book a pickup.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let labelFileUrl: string | null = null;

      // Upload label file if premium
      if (serviceType === "premium" && formData.labelFile) {
        const fileExt = formData.labelFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("return-labels")
          .upload(fileName, formData.labelFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("return-labels")
          .getPublicUrl(fileName);

        labelFileUrl = urlData.publicUrl;
      }

      // Create pickup record
      const { error: pickupError } = await supabase
        .from("pickups")
        .insert({
          user_id: user.id,
          service_type: serviceType,
          number_of_boxes: serviceType === "standard" ? parseInt(formData.numberOfBoxes) : null,
          item_size: serviceType === "premium" ? formData.itemSize as "small" | "medium" | "large" : null,
          label_file_url: labelFileUrl,
          pickup_address: `${formData.address}${formData.apartment ? `, ${formData.apartment}` : ""}, ${formData.city}, ${formData.state}`,
          pickup_zip: formData.zip,
          pickup_date: formData.pickupDate,
          pickup_time: formData.pickupTime,
          price: serviceType === "premium" ? 15 : 7,
        });

      if (pickupError) throw pickupError;

      toast({
        title: "Pickup booked!",
        description: "You'll receive a confirmation email shortly.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message || "An error occurred while booking your pickup.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        if (serviceType === "standard") {
          return formData.numberOfBoxes !== "";
        }
        return formData.itemSize !== "" && formData.labelFile !== null;
      case 3:
        return formData.address && formData.zip && formData.pickupDate && formData.pickupTime;
      default:
        return true;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-foreground">Book a Pickup</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  step >= s.number
                    ? "bg-navy text-primary-foreground"
                    : "bg-background border-2 border-border text-muted-foreground"
                )}
              >
                {step > s.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium mt-2",
                  step >= s.number ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Choose Your Service</h2>
                <p className="text-muted-foreground">Select the option that works best for you.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Standard Option */}
                <button
                  onClick={() => setServiceType("standard")}
                  className={cn(
                    "relative p-6 rounded-xl border-2 text-left transition-all duration-200",
                    serviceType === "standard"
                      ? "border-navy bg-navy/5"
                      : "border-border hover:border-navy/30"
                  )}
                >
                  {serviceType === "standard" && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-navy flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-navy" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">Standard Vdrop</h3>
                  <p className="text-sm text-muted-foreground mb-3">You pack, we pick up</p>
                  <p className="text-2xl font-bold text-foreground">$7</p>
                </button>

                {/* Premium Option */}
                <button
                  onClick={() => setServiceType("premium")}
                  className={cn(
                    "relative p-6 rounded-xl border-2 text-left transition-all duration-200",
                    serviceType === "premium"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/30"
                  )}
                >
                  {serviceType === "premium" && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-accent text-accent-foreground text-xs font-semibold">
                    Most Popular
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">Premium Vdrop</h3>
                  <p className="text-sm text-muted-foreground mb-3">We pack & print for you</p>
                  <p className="text-2xl font-bold text-foreground">$15</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Item Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Item Details</h2>
                <p className="text-muted-foreground">
                  {serviceType === "standard"
                    ? "How many boxes do you have ready?"
                    : "Tell us about your item and upload the return label."}
                </p>
              </div>

              {serviceType === "standard" ? (
                <div className="space-y-2">
                  <Label htmlFor="boxes">Number of Boxes</Label>
                  <Select
                    value={formData.numberOfBoxes}
                    onValueChange={(value) => setFormData({ ...formData, numberOfBoxes: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select number of boxes" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === 1 ? "box" : "boxes"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="size">Item Size</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      This helps our driver bring the right box size.
                    </p>
                    <Select
                      value={formData.itemSize}
                      onValueChange={(value) => setFormData({ ...formData, itemSize: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select item size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (fits in a shoebox)</SelectItem>
                        <SelectItem value="medium">Medium (fits in a carry-on)</SelectItem>
                        <SelectItem value="large">Large (needs a bigger box)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Return Label (PDF)</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload the return label you received from the retailer.
                    </p>
                    
                    {formData.labelFile ? (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/30">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {formData.labelFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(formData.labelFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={removeFile}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border hover:border-accent/50 cursor-pointer transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                          <Upload className="w-7 h-7 text-accent" />
                        </div>
                        <p className="font-medium text-foreground mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">PDF file only</p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Address & Pickup Time */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Pickup Address & Time</h2>
                <p className="text-muted-foreground">Where and when should we pick up?</p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apt/Suite (Optional)</Label>
                    <Input
                      id="apartment"
                      placeholder="Apt 4B"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="78701"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="pl-11 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Pickup Window</Label>
                    <Select
                      value={formData.pickupTime}
                      onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}
                    >
                      <SelectTrigger className="h-12">
                        <Clock className="w-5 h-5 text-muted-foreground mr-2" />
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9am-12pm">9:00 AM - 12:00 PM</SelectItem>
                        <SelectItem value="12pm-3pm">12:00 PM - 3:00 PM</SelectItem>
                        <SelectItem value="3pm-6pm">3:00 PM - 6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g., Leave at front door, gate code is 1234"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Confirm Your Booking</h2>
                <p className="text-muted-foreground">Review your pickup details below.</p>
              </div>

              <div className="space-y-4">
                {/* Service Summary */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      serviceType === "premium" ? "bg-accent/10" : "bg-navy/10"
                    )}>
                      {serviceType === "premium" ? (
                        <Sparkles className="w-5 h-5 text-accent" />
                      ) : (
                        <Package className="w-5 h-5 text-navy" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {serviceType === "premium" ? "Premium" : "Standard"} Vdrop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {serviceType === "premium"
                          ? `${formData.itemSize} item • Label uploaded`
                          : `${formData.numberOfBoxes} ${
                              formData.numberOfBoxes === "1" ? "box" : "boxes"
                            }`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Summary */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Pickup Address</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.address}
                        {formData.apartment && `, ${formData.apartment}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time Summary */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Pickup Time</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.pickupDate} • {formData.pickupTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="p-4 rounded-xl border-2 border-navy bg-navy/5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-navy">
                      ${serviceType === "premium" ? "15" : "7"}.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={step === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                variant="navy"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Confirm & Pay ${serviceType === "premium" ? "15" : "7"}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookPickup;
