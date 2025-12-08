import { Camera, Shield, Clock, HeadphonesIcon } from "lucide-react";

const TrustSection = () => {
  const features = [
    {
      icon: Camera,
      title: "Photo Confirmation",
      description: "Every drop-off is documented with a photo sent directly to your email.",
    },
    {
      icon: Shield,
      title: "Secure Handling",
      description: "Your packages are handled with care by our trained professionals.",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Track your pickup status and know exactly when your package is delivered.",
    },
    {
      icon: HeadphonesIcon,
      title: "Friendly Support",
      description: "Questions? Our team is here to help via chat, email, or phone.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4">
            Trust & Safety
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Your Packages Are in{" "}
            <span className="text-gradient">Safe Hands</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We take the responsibility of handling your returns seriously.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-navy/10 mb-5 group-hover:bg-accent/10 transition-colors">
                <feature.icon className="w-7 h-7 text-navy group-hover:text-accent transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
