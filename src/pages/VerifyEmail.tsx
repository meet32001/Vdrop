import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl opacity-10" />

      <div className="w-full max-w-md">
        <div className="bg-card/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 text-center relative overflow-hidden">
          {/* Decorative top stripe */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

          {/* Icon */}
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Mail className="w-10 h-10 text-accent" />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-foreground mb-3">Check Your Inbox</h1>
          <p className="text-muted-foreground mb-6">
            We've sent a verification link to <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>

          {/* Steps */}
          <div className="text-left bg-secondary/50 rounded-xl p-4 mb-8 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent">1</span>
              </div>
              <p className="text-sm text-muted-foreground">Open the email from <strong>Vdrop</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent">2</span>
              </div>
              <p className="text-sm text-muted-foreground">Click the <strong>Confirm your mail</strong> link</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent">3</span>
              </div>
              <p className="text-sm text-muted-foreground">Log in to your dashboard</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/login">
              <Button variant="default" className="w-full bg-navy hover:bg-navy-dark text-white">
                Back to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <p className="text-xs text-muted-foreground mt-4">
              Didn't receive it? <span className="text-accent cursor-pointer hover:underline">Resend email</span>
            </p>
          </div>
        </div>
        
        {/* Footer help */}
        <p className="text-center text-primary-foreground/60 text-sm mt-8">
          Need help? <a href="#" className="underline hover:text-primary-foreground">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
