import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Package, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isLanding = location.pathname === "/";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isLanding 
        ? "bg-navy/95 backdrop-blur-md border-b border-navy-light/20" 
        : "bg-background/95 backdrop-blur-md border-b border-border"
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group-hover:scale-105",
              isLanding ? "bg-accent" : "bg-navy"
            )}>
              <Package className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className={cn(
              "text-2xl font-bold tracking-tight",
              isLanding ? "text-primary-foreground" : "text-foreground"
            )}>
              Vdrop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isLanding && (
              <>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="text-primary-foreground/80 hover:text-accent font-medium transition-colors"
                >
                  Services & Pricing
                </button>
                <button 
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-primary-foreground/80 hover:text-accent font-medium transition-colors"
                >
                  How it Works
                </button>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button 
                variant={isLanding ? "ghost" : "ghost"} 
                className={cn(
                  isLanding && "text-primary-foreground/90 hover:text-accent hover:bg-accent/10"
                )}
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="accent">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={cn("w-6 h-6", isLanding ? "text-primary-foreground" : "text-foreground")} />
            ) : (
              <Menu className={cn("w-6 h-6", isLanding ? "text-primary-foreground" : "text-foreground")} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        )}>
          <div className="flex flex-col gap-2 pt-4">
            {isLanding && (
              <>
                <button 
                  onClick={() => scrollToSection("services")}
                  className={cn(
                    "py-3 px-4 rounded-lg text-left font-medium transition-colors",
                    "text-primary-foreground/80 hover:text-accent hover:bg-accent/10"
                  )}
                >
                  Services & Pricing
                </button>
                <button 
                  onClick={() => scrollToSection("how-it-works")}
                  className={cn(
                    "py-3 px-4 rounded-lg text-left font-medium transition-colors",
                    "text-primary-foreground/80 hover:text-accent hover:bg-accent/10"
                  )}
                >
                  How it Works
                </button>
              </>
            )}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-primary-foreground/10">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant={isLanding ? "ghost" : "outline"} className={cn(
                  "w-full justify-center",
                  isLanding && "text-primary-foreground hover:bg-accent/10"
                )}>
                  Log in
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button variant="accent" className="w-full justify-center">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
