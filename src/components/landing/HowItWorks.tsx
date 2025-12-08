import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarCheck, Package, Truck, Camera, Hand, Printer, Box } from "lucide-react";

type ServiceType = "standard" | "premium";

const HowItWorks = () => {
  const [activeService, setActiveService] = useState<ServiceType>("premium");

  const steps = {
    standard: [
      {
        icon: CalendarCheck,
        title: "Book & Select Service",
        description: "Choose Standard Vdrop and pick your preferred pickup time.",
      },
      {
        icon: Package,
        title: "Leave Package at Door",
        description: "Pack your box, print & attach the label, and leave it at your door.",
      },
      {
        icon: Truck,
        title: "We Pick Up & Drop Off",
        description: "Our driver picks up your package and delivers it to the courier.",
      },
      {
        icon: Camera,
        title: "Get Photo Confirmation",
        description: "Receive an email with photo proof of drop-off for your peace of mind.",
      },
    ],
    premium: [
      {
        icon: CalendarCheck,
        title: "Book & Upload Label",
        description: "Choose Premium Vdrop, select your item size, and upload your return label PDF.",
      },
      {
        icon: Hand,
        title: "Hand Us the Item",
        description: "Just hand us your item. We bring the box, tape, and printed label.",
      },
      {
        icon: Box,
        title: "We Pack & Label",
        description: "We professionally pack your item and attach the label on the spot.",
      },
      {
        icon: Camera,
        title: "Same-Day Drop-Off",
        description: "We deliver same-day and email you the photo receipt.",
      },
    ],
  };

  const currentSteps = steps[activeService];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy font-semibold text-sm mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple Steps to{" "}
            <span className="text-gradient">Stress-Free Returns</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Toggle between services to see how easy it is.
          </p>

          {/* Service Toggle */}
          <div className="inline-flex items-center p-1.5 rounded-xl bg-background border border-border shadow-sm">
            <button
              onClick={() => setActiveService("standard")}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200",
                activeService === "standard"
                  ? "bg-navy text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Standard Vdrop
            </button>
            <button
              onClick={() => setActiveService("premium")}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200",
                activeService === "premium"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Premium Vdrop
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {currentSteps.map((step, index) => (
            <div
              key={`${activeService}-${index}`}
              className="relative group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector Line */}
              {index < currentSteps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
              )}

              <div className="relative bg-card rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center shadow-md">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-5",
                  activeService === "premium" ? "bg-accent/10" : "bg-navy/10"
                )}>
                  <step.icon className={cn(
                    "w-7 h-7",
                    activeService === "premium" ? "text-accent" : "text-navy"
                  )} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
