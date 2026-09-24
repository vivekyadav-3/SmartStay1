import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Clock, 
  MessageSquareWarning, 
  CalendarClock, 
  Megaphone, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { syncUser, getAdminStats } from "@/app/actions/user";
import { getCurrentMealInfo } from "@/app/actions/mess-menu";
import { getCurfewInfo } from "@/app/actions/gate-pass";
import { getNotices } from "@/app/actions/notices";
import StudentHeader from "@/components/dashboard/student-header";
import AdminCharts from "@/components/dashboard/admin-charts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await syncUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Building2 className="size-14 text-emerald-500/30 animate-pulse" />
        <h2 className="text-2xl font-bold">Setting up KIIT SmartStay...</h2>
        <p className="text-muted-foreground max-w-sm text-sm">Loading resident information and hostel services.</p>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const adminStats = isAdmin ? await getAdminStats() : null;

  // Real data queries
  const mealInfo = await getCurrentMealInfo();
  const curfewInfo = await getCurfewInfo();
  const notices = await getNotices();

  const activeComplaints = await prisma.complaint.findMany({
    where: isAdmin ? {} : { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const pendingComplaintsCount = await prisma.complaint.count({
    where: isAdmin ? { status: "PENDING" } : { userId: user.id, status: { not: "RESOLVED" } },
  });

  const latestLaundry = await prisma.laundryBooking.findFirst({
    where: isAdmin ? {} : { userId: user.id },
    orderBy: { bookingDate: "desc" },
  });

  const latestGatePass = await prisma.gatePass.findFirst({
    where: isAdmin ? {} : { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Food review average
  const reviews = await prisma.foodReview.findMany({ take: 5, orderBy: { createdAt: "desc" } });
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.overallRating, 0) / reviews.length).toFixed(1) : "4.4";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Student Identity Header Bar (Roll Number, Hostel, Room, Biometric) */}
      <StudentHeader user={user} />

      {/* 2. Top Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mess Status */}
        <Link href="/dashboard/mess-menu" className="group">
          <Card className="bg-card/70 border-white/10 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:scale-[1.01] active:scale-[0.99] h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                Hostel Mess
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <UtensilsCrossed className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate text-foreground">
                {mealInfo.activeMeal ? `${mealInfo.activeMeal} Serving` : mealInfo.nextMeal}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {mealInfo.currentMealItem?.specialItem || "Today: Authentic Odia Dalma & Feast"}
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <span>View 7-day menu</span>
                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Curfew & Gate In-Time */}
        <Link href="/dashboard/timings" className="group">
          <Card className="bg-card/70 border-white/10 backdrop-blur-md transition-all hover:border-blue-500/50 hover:scale-[1.01] active:scale-[0.99] h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                Biometric & Curfew
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Clock className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-bold ${user.biometricStatus === "OUTSIDE_CAMPUS" || user.biometricStatus === "OUT" ? "text-amber-400" : "text-foreground"}`}>
                {user.biometricStatus === "OUTSIDE_CAMPUS" || user.biometricStatus === "OUT" ? "OUTSIDE CAMPUS" : "HOSTEL IN-CAMPUS"}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {user.biometricStatus === "OUTSIDE_CAMPUS" || user.biometricStatus === "OUT" ? "Pass: GP-2026-0812 • Curfew 08:30 PM" : "KP-7 Room 412 • Curfew 08:30 PM"}
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-blue-400 font-medium">
                <span>{user.biometricStatus === "OUTSIDE_CAMPUS" || user.biometricStatus === "OUT" ? "Scan Return at Gate" : "Pass & Timings"}</span>
                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Active Complaints */}
        <Link href="/dashboard/complaints" className="group">
          <Card className="bg-card/70 border-white/10 backdrop-blur-md transition-all hover:border-orange-500/50 hover:scale-[1.01] active:scale-[0.99] h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                Maintenance
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <MessageSquareWarning className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">
                {pendingComplaintsCount} Active Ticket{pendingComplaintsCount !== 1 ? "s" : ""}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {activeComplaints[0]?.assignedTo ? `${activeComplaints[0].assignedTo}` : "Hostel Electrician & Plumber"}
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-orange-400 font-medium">
                <span>Track or raise ticket</span>
                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Laundry & Rating */}
        <Link href="/dashboard/laundry" className="group">
          <Card className="bg-card/70 border-white/10 backdrop-blur-md transition-all hover:border-purple-500/50 hover:scale-[1.01] active:scale-[0.99] h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                Laundry Token
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <CalendarClock className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">
                {latestLaundry ? (latestLaundry as any).token || (latestLaundry as any).tokenNumber : "Book a Slot"}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {latestLaundry ? `Status: ${(latestLaundry as any).stage || (latestLaundry as any).status} (OTP: ${latestLaundry.pickupOtp})` : "30 clothes quota available"}
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-purple-400 font-medium">
                <span>Laundry desk status</span>
                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {isAdmin && <AdminCharts data={adminStats} />}

      {/* 3. Quick Action Feature Hub */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-400" />
          <span>KIIT Hostel Services Hub</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link href="/dashboard/mess-menu" className="p-4 rounded-xl bg-card/60 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-center flex flex-col items-center gap-2 group">
            <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Mess Menu</span>
            <span className="text-[10px] text-muted-foreground">7-Day Schedule</span>
          </Link>

          <Link href="/dashboard/timings" className="p-4 rounded-xl bg-card/60 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center flex flex-col items-center gap-2 group">
            <div className="size-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Curfew Timings</span>
            <span className="text-[10px] text-muted-foreground">Gate Pass & In-Time</span>
          </Link>

          <Link href="/dashboard/complaints" className="p-4 rounded-xl bg-card/60 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-center flex flex-col items-center gap-2 group">
            <div className="size-11 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquareWarning className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Complaints</span>
            <span className="text-[10px] text-muted-foreground">Track with OTP</span>
          </Link>

          <Link href="/dashboard/laundry" className="p-4 rounded-xl bg-card/60 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center flex flex-col items-center gap-2 group">
            <div className="size-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarClock className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Laundry</span>
            <span className="text-[10px] text-muted-foreground">Drop-off & Token</span>
          </Link>

          <Link href="/dashboard/announcements" className="p-4 rounded-xl bg-card/60 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center flex flex-col items-center gap-2 group">
            <div className="size-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Megaphone className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Announcements</span>
            <span className="text-[10px] text-muted-foreground">Hostel Circulars</span>
          </Link>

          <Link href="/dashboard/food-review" className="p-4 rounded-xl bg-card/60 border border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all text-center flex flex-col items-center gap-2 group">
            <div className="size-11 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Food Review</span>
            <span className="text-[10px] text-muted-foreground">{avgRating}/5.0 Score</span>
          </Link>
        </div>
      </div>

      {/* 4. Split Grid: Today's Mess Special + Official Announcements + Live Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Special & Meal Schedule Card */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <UtensilsCrossed className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Today's Mess Schedule ({mealInfo.currentDayName})</CardTitle>
                <p className="text-xs text-muted-foreground">KP-7 Mess & Dining Hall • Campus 12</p>
              </div>
            </div>
            <Link href="/dashboard/mess-menu">
              <Button variant="outline" size="sm" className="text-xs h-8 border-white/10 hover:border-emerald-500/40">
                Full Week
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {mealInfo.schedule.map((item) => {
              const isCurrent = mealInfo.activeMeal === item.type;
              return (
                <div 
                  key={item.name} 
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent 
                      ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm" 
                      : "bg-black/20 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      {item.name}
                      {isCurrent && (
                        <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px] h-4">
                          SERVING NOW
                        </Badge>
                      )}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.type === "BREAKFAST" && "Hot Idli & Medu Vada, Madras Sambar, Chutney, Tea/Coffee"}
                    {item.type === "LUNCH" && "Veg Pulao, Odia Dalma, Aloo Bhaja, Butter Chicken / Paneer Lababdar, Curd"}
                    {item.type === "SNACKS" && "Mumbai Pav Bhaji with Butter Toasted Buns, Masala Chai"}
                    {item.type === "DINNER" && "Butter Naan, Kashmiri Pulao, Dal Fry, Malai Kofta / Egg Curry, Jalebi"}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Official KIIT Notice Board */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Megaphone className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Official Announcements</CardTitle>
                <p className="text-xs text-muted-foreground">Chief Warden & Student Affairs Circulars</p>
              </div>
            </div>
            <Link href="/dashboard/announcements">
              <Button variant="outline" size="sm" className="text-xs h-8 border-white/10 hover:border-amber-500/40">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div key={notice.id} className="p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/15 transition-all space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground line-clamp-1">{notice.title}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] h-4 shrink-0 ${
                      notice.priority === "URGENT" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
                      notice.priority === "IMPORTANT" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {notice.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{notice.content}</p>
                <p className="text-[10px] text-emerald-400/80 font-medium">Issued by: {notice.issuedBy}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 5. Live Maintenance Requests Timeline */}
      <Card className="bg-card/70 border-white/10 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <MessageSquareWarning className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Recent Maintenance Tickets</CardTitle>
              <p className="text-xs text-muted-foreground">Assigned technicians & OTP verification for closure</p>
            </div>
          </div>
          <Link href="/dashboard/complaints">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8">
              + File New Ticket
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="divide-y divide-white/5">
            {activeComplaints.map((c) => (
              <div key={c.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{c.ticketId}</span>
                    <span className="text-xs font-semibold text-foreground">• {c.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assigned: <strong className="text-foreground">{c.assignedTo}</strong> ({c.assignedContact})
                  </p>
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Closure OTP:</span>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {c.resolutionOtp}
                    </span>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      c.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                      c.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {c.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
