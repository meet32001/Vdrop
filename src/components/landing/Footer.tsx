import { Link } from "react-router-dom";
import { Package, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent">
                <Package className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground tracking-tight">
                Vdrop
              </span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              Making returns as easy as they should be. From your doorstep to the courier.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Services & Pricing", href: "#services" },
                { label: "How it Works", href: "#how-it-works" },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/faq" 
                  className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <a 
                  href="mailto:hello@vdrop.com" 
                  className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                >
                  hello@vdrop.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <a 
                  href="tel:+15551234567" 
                  className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                >
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span className="text-primary-foreground/60 text-sm">
                  London, ON
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} Vdrop. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
