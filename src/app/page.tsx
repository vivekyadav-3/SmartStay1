import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  UtensilsCrossed, 
  Clock, 
  MessageSquareWarning, 
  CalendarClock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Star,
  CheckCircle2,
  GraduationCap
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* KIIT Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 px-4 py-2 text-center text-xs text-emerald-100 flex items-center justify-center gap-2 border-b border-emerald-500/30">
        <Sparkles className="size-3.5 text-emerald-300 animate-pulse" />
        <span className="font-semibold">KIIT Deemed to be University, Bhubaneswar</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hidden sm:inline">King's Palace & Queen's Castle Smart Hostel Portal</span>
      </div>

      {/* Navigation Header */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-white/10 sticky top-0 bg-background/90 backdrop-blur-xl z-50">
        <Link className="flex items-center gap-3 group" href="/">
          <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              KIIT SmartStay
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 py-0">
                Hostel 3.0
              </Badge>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Kalinga Institute of Industrial Technology, Bhubaneswar
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          <Link href="/dashboard" className="text-xs sm:text-sm font-medium hover:text-emerald-400 transition-colors hidden sm:block">
            Live Student Demo
          </Link>
          <Link href="/dashboard/mess-menu" className="text-xs sm:text-sm font-medium hover:text-emerald-400 transition-colors hidden md:block">
            Mess Menu
          </Link>
          <Link href="/dashboard/timings" className="text-xs sm:text-sm font-medium hover:text-emerald-400 transition-colors hidden md:block">
            Curfew Rules
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 text-xs font-semibold shadow-lg shadow-emerald-600/20">
              Open Portal <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative overflow-hidden">
        {/* Background Gradients & Glows */}
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none" />

        <section className="w-full py-16 md:py-28 lg:py-36 flex justify-center text-center relative z-10 px-4">
          <div className="max-w-4xl flex flex-col items-center gap-6">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
              <GraduationCap className="size-4 text-emerald-400" />
              <span>Designed for KIIT Bhubaneswar Hostels • 3rd Year Capstone Prototype</span>
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Hostel Living, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500">
                Smarter & Paperless.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Integrated hostel automation for <strong>King's Palace (KP-1 to KP-18)</strong> and <strong>Queen's Castle (QC-1 to QC-11)</strong> residents. Check daily mess menus, track curfew & biometric in-time, file maintenance tickets with OTP, and book laundry slots instantly.
            </p>

            {/* Quick Demo Launch Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-8 h-12 text-sm font-bold shadow-xl shadow-emerald-600/30 gap-2">
                  Launch Student Portal <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/dashboard/mess-menu" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl px-8 h-12 text-sm font-semibold border-white/15 bg-card/40 hover:bg-white/5">
                  View 7-Day Mess Menu
                </Button>
              </Link>
            </div>

            {/* Highlights Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl text-left border-t border-white/10 mt-6">
              <div className="p-3 rounded-xl bg-card/40 border border-white/5">
                <span className="text-xl font-bold font-mono text-emerald-400">22051934</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Roll No & ID Tracking</p>
              </div>
              <div className="p-3 rounded-xl bg-card/40 border border-white/5">
                <span className="text-xl font-bold font-mono text-emerald-400">08:30 PM</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Curfew & Gate Passes</p>
              </div>
              <div className="p-3 rounded-xl bg-card/40 border border-white/5">
                <span className="text-xl font-bold font-mono text-emerald-400">KP-7 & QC</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Campus 12 Allotments</p>
              </div>
              <div className="p-3 rounded-xl bg-card/40 border border-white/5">
                <span className="text-xl font-bold font-mono text-emerald-400">4.4 / 5.0 ⭐</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Food Rating System</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Showcase */}
        <section className="w-full py-16 bg-slate-950/60 border-y border-white/10 px-6 lg:px-14">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Everything A KIITian Needs Daily
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Engineered specifically for the scale and requirements of KIIT University residences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Mess Menu & Timings */}
              <div className="p-6 rounded-3xl bg-card/60 border border-white/10 hover:border-emerald-500/40 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Mess Menu & Timings</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Interactive 7-day schedule with Veg & Non-Veg counters, authentic Odia delicacies (Dalma, Fish Curry, Kheer), and live breakfast/lunch/dinner operating hours.
                </p>
                <Link href="/dashboard/mess-menu" className="inline-flex items-center text-xs font-semibold text-emerald-400 gap-1 hover:underline pt-1">
                  Explore Weekly Menu <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 2: Curfew & Digital Gate Pass */}
              <div className="p-6 rounded-3xl bg-card/60 border border-white/10 hover:border-blue-500/40 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Curfew & Gate Timings</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strict 08:30 PM curfew countdown, digital biometric attendance punch, and automated Outing Passes with verifiable QR codes for library and market visits.
                </p>
                <Link href="/dashboard/timings" className="inline-flex items-center text-xs font-semibold text-blue-400 gap-1 hover:underline pt-1">
                  View Curfew System <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 3: Complaints with Technician & OTP */}
              <div className="p-6 rounded-3xl bg-card/60 border border-white/10 hover:border-orange-500/40 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquareWarning className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Maintenance & OTP Tracking</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Log electrical, plumbing, Wi-Fi or carpentry issues. Assigned directly to KP-7 field staff with 4-digit resolution OTP for verified closure.
                </p>
                <Link href="/dashboard/complaints" className="inline-flex items-center text-xs font-semibold text-orange-400 gap-1 hover:underline pt-1">
                  Track Complaints <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 4: Laundry Tokens */}
              <div className="p-6 rounded-3xl bg-card/60 border border-white/10 hover:border-purple-500/40 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarClock className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Laundry Token System</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Track your 30-piece monthly quota, reserve washing machine slots at KP-7 basement counter, and get notified when clothes are folded and ready for pickup.
                </p>
                <Link href="/dashboard/laundry" className="inline-flex items-center text-xs font-semibold text-purple-400 gap-1 hover:underline pt-1">
                  Book Machine Slot <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 5: Official Circulars */}
              <div className="p-6 rounded-3xl bg-card/60 border border-white/10 hover:border-amber-500/40 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Announcements & Notices</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Direct notifications from Chief Warden & Student Affairs Directorate regarding Kritansh Fest extensions, maintenance inspections, and exam quiet hours.
                </p>
                <Link href="/dashboard/announcements" className="inline-flex items-center text-xs font-semibold text-amber-400 gap-1 hover:underline pt-1">
                  Read Circulars <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 6: Food Review & Satisfaction */}
              <div className="p-6 rounded-3xl bg-card/60 border border-white/10 hover:border-yellow-500/40 transition-all space-y-3 group">
                <div className="size-12 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Food Review & Rating</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Daily feedback on taste, cleanliness, and quantity. Contributes to the live KIIT Mess Satisfaction Index reviewed weekly by the Student Mess Committee.
                </p>
                <Link href="/dashboard/food-review" className="inline-flex items-center text-xs font-semibold text-yellow-400 gap-1 hover:underline pt-1">
                  Submit Feedback <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-slate-950/80 text-muted-foreground text-xs text-center space-y-2">
        <p className="font-semibold text-foreground">
          KIIT SmartStay • Kalinga Institute of Industrial Technology, Bhubaneswar
        </p>
        <p>
          Software Engineering Subject Prototype • 3rd Year B.Tech Computer Science & Engineering
        </p>
      </footer>
    </div>
  );
}
