import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 pt-32 lg:pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-accent">Now serving London, ON</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Returns Made Easy.{" "}
              <span className="text-gradient">No Car? No Printer?</span>{" "}
              No Problem.
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-xl">
              From your doorstep to the courier. We handle the driving, and even the packing. 
              Finally, returns as easy as they should be.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/login">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Book a Pickup
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button 
                variant="hero-outline" 
                size="xl" 
                className="w-full sm:w-auto"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                See How it Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">Photo Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">Same-Day Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">We Can Pack For You</span>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card/10 backdrop-blur-xl rounded-3xl p-8 border border-primary-foreground/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                    <Package className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-foreground">Your Return</h3>
                    <p className="text-primary-foreground/60 text-sm">Ready for pickup</p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="text-primary-foreground font-medium">Pickup Scheduled</p>
                      <p className="text-primary-foreground/50 text-sm">Today, 2:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/5">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-primary-foreground/80 font-medium">Driver En Route</p>
                      <p className="text-primary-foreground/50 text-sm">Arriving in 15 mins</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/5">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary-foreground/40" />
                    </div>
                    <div className="flex-1">
                      <p className="text-primary-foreground/50 font-medium">Dropped Off</p>
                      <p className="text-primary-foreground/30 text-sm">Photo confirmation sent</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-semibold shadow-glow animate-float">
                📦 Picked Up!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
