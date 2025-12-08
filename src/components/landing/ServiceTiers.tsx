import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Package, Printer, Clock, Box, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ServiceTiers = () => {
  return (
    <section id="services" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your Level of{" "}
            <span className="text-gradient">Convenience</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're ready to go or need the full white-glove treatment, we've got you covered.
          </p>
        </div>

        {/* Service Cards */}
        <div id="pricing" className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Standard Tier */}
          <div className="group relative rounded-2xl bg-card border-2 border-border p-8 lg:p-10 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Package className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Standard Vdrop</h3>
                <p className="text-muted-foreground text-sm">For those who are ready to go</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-foreground">$7</span>
              <span className="text-muted-foreground">/pickup</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-navy" />
                </div>
                <span className="text-foreground">You pack the box</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-navy" />
                </div>
                <span className="text-foreground">You print & stick the label</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-navy" />
                </div>
                <span className="text-foreground">Next-day pickup & drop-off</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-navy" />
                </div>
                <span className="text-foreground">Photo confirmation receipt</span>
              </li>
            </ul>

            <Link to="/signup">
              <Button variant="navy-outline" className="w-full" size="lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="group relative rounded-2xl bg-navy p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
              <Star className="w-3.5 h-3.5" />
              Most Popular
            </div>

            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">Premium Vdrop</h3>
                  <p className="text-primary-foreground/60 text-sm">The ultimate convenience</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl lg:text-5xl font-bold text-primary-foreground">$15</span>
                <span className="text-primary-foreground/60">/pickup</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <Printer className="w-3 h-3 text-accent" />
                  </div>
                  <div>
                    <span className="text-primary-foreground font-medium">We Print the Label</span>
                    <p className="text-primary-foreground/50 text-sm">Just upload your PDF</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <Box className="w-3 h-3 text-accent" />
                  </div>
                  <div>
                    <span className="text-primary-foreground font-medium">We Pack the Item</span>
                    <p className="text-primary-foreground/50 text-sm">We bring the box and tape</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <Clock className="w-3 h-3 text-accent" />
                  </div>
                  <div>
                    <span className="text-primary-foreground font-medium">Priority Speed</span>
                    <p className="text-primary-foreground/50 text-sm">Same-day pickup & drop-off</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-primary-foreground">Photo confirmation receipt</span>
                </li>
              </ul>

              <Link to="/signup">
                <Button variant="accent" className="w-full" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTiers;
