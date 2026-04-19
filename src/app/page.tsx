import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, ShieldCheck, MessageSquareWarning, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-16 flex items-center border-b border-white/10 glass-nav z-50 sticky top-0 bg-background/80 backdrop-blur-md">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">SmartStay</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="/login">
            Login
          </Link>
          <Link href="/login">
            <Button size="sm" className="rounded-full px-6">Get Started</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 border-t border-t-white/5 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

        <section className="w-full py-20 md:py-32 lg:py-48 flex justify-center text-center relative z-10 px-4">
          <div className="max-w-[800px] flex flex-col items-center gap-6">
            <Badge variant="secondary" className="px-3 py-1 rounded-full bg-white/5 text-white/80 border-white/10 hover:bg-white/10 transition-colors">
              🎉 Smart Hostel Management is here
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 pb-2">
              Hostel life, <br /> minus the chaos.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Submit complaints, book laundry slots, and get visitor passes without standing in a single line. Built for students, loved by admins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/login">
                <Button size="lg" className="rounded-full px-8 gap-2 h-12 text-md">
                  Student Portal <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-md border-white/10 bg-white/5 hover:bg-white/10">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-16 lg:py-24 bg-black/40 border-y border-white/5 relative z-10 px-6 lg:px-14">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-primary/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <MessageSquareWarning className="size-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold">Quick Complaints</h3>
              <p className="text-muted-foreground leading-relaxed">Snap a photo and submit. Track your complaint status directly from your phone. No more registers.</p>
            </div>
            
            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-primary/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <CalendarClock className="size-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Laundry Slots</h3>
              <p className="text-muted-foreground leading-relaxed">Book a machine without the rush. Get notified when your turn is up. Respect everyone's time.</p>
            </div>
            
            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-primary/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="size-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Visitor Passes</h3>
              <p className="text-muted-foreground leading-relaxed">Request visitor entry and get instant admin approvals via digital QR passes. Completely paperless.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 flex text-center justify-center border-t border-white/5 bg-black/20 text-muted-foreground text-sm z-10">
        <p>© {new Date().getFullYear()} SmartStay. Built beautifully.</p>
      </footer>
    </div>
  );
}
