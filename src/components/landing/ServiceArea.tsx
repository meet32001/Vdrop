import { MapPin, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ServiceArea = () => {
  const [email, setEmail] = useState("");

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when Vdrop comes to your area.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-navy to-navy-dark rounded-3xl p-8 lg:p-14 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />

            <div className="relative text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-6">
                <MapPin className="w-8 h-8 text-accent" />
              </div>

              {/* Content */}
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Currently Serving London, ON
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
                We're expanding! Sign up to be notified when Vdrop launches in your city.
              </p>

              {/* Email Form */}
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
                <Button type="submit" variant="accent" size="lg" className="whitespace-nowrap">
                  <Bell className="w-4 h-4" />
                  Notify Me
                </Button>
              </form>

              {/* Cities Coming Soon */}
              <div className="mt-10 pt-8 border-t border-primary-foreground/10">
                <p className="text-sm text-primary-foreground/50 mb-3">Coming Soon</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Toronto", "Kitchener", "Waterloo", "Hamilton", "Woodstock"].map((city) => (
                    <span
                      key={city}
                      className="px-4 py-2 rounded-full bg-primary-foreground/5 text-primary-foreground/60 text-sm font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea;
