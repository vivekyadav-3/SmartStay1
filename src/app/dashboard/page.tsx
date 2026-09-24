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

      {/* 2. Clean Friday 1 Overview: Hostel Status & Active Gate Pass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Hostel Status */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground">
              Hostel Status
            </CardTitle>
            <ShieldCheck className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                IN HOSTEL
              </span>
              <p className="text-xs text-muted-foreground">
                Campus 12 • King's Palace 7 • Room {user.studentProfile?.roomNo || "412"} (Bed {user.studentProfile?.bedNo || "B"})
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Nightly Gate Curfew
              </span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                08:30 PM
              </span>
              <p className="text-[11px] text-muted-foreground">
                All residents must report to KP-7 gate before curfew or hold an approved digital gate pass.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right: Gate Pass Status */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground">
              Gate Pass
            </CardTitle>
            <Clock className="size-4 text-blue-400" />
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold font-mono text-foreground">
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

            <div className="space-y-1">
              <span className="text-xs font-semibold text-foreground">
                Destination: {latestGatePass?.destination || "KIIT Central Library (Campus 6)"}
              </span>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Purpose: {latestGatePass?.purpose || "3rd-year semester capstone project research and group coding"}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <Link href="/dashboard/timings">
                <Button size="sm" variant="outline" className="border-white/10 text-xs h-8 hover:border-emerald-500/40">
                  View Pass Details →
                </Button>
              </Link>
              {latestGatePass?.status === "APPROVED" && (
                <span className="text-[11px] text-emerald-400 font-medium">✓ Approved by Warden</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Primary Action Button: Apply for Gate Pass */}
      <div className="flex justify-center pt-2">
        <Link href="/dashboard/timings">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-xl shadow-emerald-600/20 text-sm">
            + Apply for Gate Pass
          </Button>
        </Link>
      </div>
    </div>
  );
}
