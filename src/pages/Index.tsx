import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ServiceTiers from "@/components/landing/ServiceTiers";
import HowItWorks from "@/components/landing/HowItWorks";
import ServiceArea from "@/components/landing/ServiceArea";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ServiceTiers />
        <HowItWorks />
        <ServiceArea />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
