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

      {/* 2. Focused 1/4 Prototype Highlights: Gate Pass & Biometric Real-Time Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Curfew & Biometric Live Status */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Real-Time Biometric Status
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-extrabold ${user.biometricStatus === "OUTSIDE_CAMPUS" || user.biometricStatus === "OUT" ? "text-amber-400" : "text-emerald-400"}`}>
              {user.biometricStatus === "OUTSIDE_CAMPUS" || user.biometricStatus === "OUT" ? "OUTSIDE CAMPUS" : "IN HOSTEL (CAMPUS 12)"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hostel KP-7 • Room {user.studentProfile?.roomNo || "412"} • Curfew 08:30 PM
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${user.biometricStatus === "OUTSIDE_CAMPUS" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}`}>
                {user.biometricStatus === "OUTSIDE_CAMPUS" ? "Punched OUT on Gate Pass" : "Verified In-Campus Resident"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Latest Gate Pass Status & Quick Link */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active / Recent Gate Pass
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-foreground">
                {latestGatePass?.passCode || "GP-2026-0812"}
              </span>
              <Badge 
                className={`text-xs font-bold ${
                  latestGatePass?.status === "APPROVED" ? "bg-emerald-500 text-slate-950" :
                  latestGatePass?.status === "ACTIVE" ? "bg-blue-500 text-white" :
                  latestGatePass?.status === "COMPLETED" ? "bg-slate-700 text-white" :
                  "bg-amber-500 text-slate-950"
                }`}
              >
                {latestGatePass?.status || "PENDING"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Destination: {latestGatePass?.destination || "KIIT Central Library (Campus 6)"}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <Link href="/dashboard/timings">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8">
                  + Apply New Pass
                </Button>
              </Link>
              <Link href="/dashboard/warden" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                <span>Warden View</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdmin && <AdminCharts data={adminStats} />}

      {/* 3. Direct Gate Pass Action & Workflow Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Gate Pass Request Action Card */}
        <Card className="lg:col-span-2 bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Clock className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Quick Gate Pass Workflow</CardTitle>
                <p className="text-xs text-muted-foreground">Apply for library, academic or personal outing pass</p>
              </div>
            </div>
            <Link href="/dashboard/timings">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8">
                Open Full Pass Form
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Step 1: Student</span>
                <p className="text-xs font-semibold text-foreground">Apply Gate Pass</p>
                <p className="text-[11px] text-muted-foreground">Creates record in DB with state PENDING</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Step 2: Warden</span>
                <p className="text-xs font-semibold text-foreground">Warden Approval</p>
                <p className="text-[11px] text-muted-foreground">Prof. S.K. Mohapatra reviews & approves</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Step 3: Security</span>
                <p className="text-xs font-semibold text-foreground">Punch Out / In</p>
                <p className="text-[11px] text-muted-foreground">Main gate verifies & logs out-of-campus</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-black/40 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-300">Ready to test the Gate Pass cycle?</span>
                <p className="text-xs text-muted-foreground">Navigate to the Timings & Gate Pass portal to create a live pass.</p>
              </div>
              <Link href="/dashboard/timings">
                <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs">
                  Go to Gate Pass →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Prototype 1 Info Card */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-base font-bold text-foreground">
              SmartStay Prototype 1/4
            </CardTitle>
            <p className="text-xs text-muted-foreground">Core Architecture & Live Workflow</p>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs text-muted-foreground">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <span className="text-[11px] font-bold text-foreground block">Active Demo Persona:</span>
              <p className="font-mono text-emerald-300">{user.name} ({user.role})</p>
              <p className="text-[10px]">Roll No: {user.studentProfile?.rollNo || "22051934"}</p>
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px]">
                <span>Prisma SQLite Engine</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">Connected</Badge>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Gate Pass State Machine</span>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]">PENDING → APPROVED</Badge>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Biometric Status Sync</span>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
