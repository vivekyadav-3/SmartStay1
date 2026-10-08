import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  Wrench, 
  Megaphone, 
  UtensilsCrossed, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  WashingMachine as WashingIcon,
  ArrowRight,
  Sparkles,
  Calendar,
  ThumbsUp,
  Star
} from "lucide-react";
import Link from "next/link";
import { syncUser } from "@/app/actions/user";
import { getNotices } from "@/app/actions/notices";
import { getWashingMachines } from "@/app/actions/washing-machine";
import StudentHeader from "@/components/dashboard/student-header";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const activeUser = await syncUser();

  // Find student resident (Vivek Yadav)
  let studentUser = activeUser?.role === "STUDENT" ? activeUser : await prisma.user.findFirst({
    where: { id: "student_vivek_22051934", role: "STUDENT" },
    include: {
      studentProfile: { include: { hostel: true } },
    },
  });

  if (!studentUser || studentUser.role !== "STUDENT") {
    studentUser = await prisma.user.findFirst({
      where: { role: "STUDENT" },
      include: {
        studentProfile: { include: { hostel: true } },
      },
    });
  }

  const user = studentUser || activeUser;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Building2 className="size-14 text-blue-600/30 animate-pulse" />
        <h2 className="text-2xl font-bold text-slate-800">Setting up KIIT SmartStay...</h2>
        <p className="text-slate-500 max-w-sm text-sm">Loading resident information and hostel services.</p>
      </div>
    );
  }

  // Fetch live notices, washing machines, latest passes and complaints
  const notices = await getNotices();
  const machines = await getWashingMachines();
  const vacantMachines = machines.filter((m) => m.status === "VACANT").length;
  const totalMachines = machines.length;

  const latestPass = await prisma.gatePass.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const activeComplaints = await prisma.complaint.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  const reviews = await prisma.foodReview.findMany({ take: 6, orderBy: { createdAt: "desc" } });
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.overallRating, 0) / reviews.length).toFixed(1) : "4.3";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Student Identity Header Bar (Roll Number, Hostel, Room, Biometric) */}
      <StudentHeader user={user} />

      {/* 2. Quick-Access Service Grid (White & Blue Institutional Theme) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link
          href="/dashboard/gate-pass"
          className="flex flex-col items-center justify-center p-3.5 bg-white border border-blue-100 hover:border-blue-400 rounded-2xl shadow-xs hover:shadow-md transition-all group text-center"
        >
          <div className="size-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-2">
            <BookOpen className="size-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Library Pass</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Campus 6 Reading</span>
        </Link>

        <Link
          href="/dashboard/laundry"
          className="flex flex-col items-center justify-center p-3.5 bg-white border border-blue-100 hover:border-blue-400 rounded-2xl shadow-xs hover:shadow-md transition-all group text-center"
        >
          <div className="size-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-2">
            <WashingIcon className="size-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Washing Machines</span>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5">{vacantMachines} Vacant Now</span>
        </Link>

        <Link
          href="/dashboard/announcements"
          className="flex flex-col items-center justify-center p-3.5 bg-white border border-blue-100 hover:border-blue-400 rounded-2xl shadow-xs hover:shadow-md transition-all group text-center"
        >
          <div className="size-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-2">
            <Megaphone className="size-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Notice Board</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Menu & Events</span>
        </Link>

        <Link
          href="/dashboard/complaints"
          className="flex flex-col items-center justify-center p-3.5 bg-white border border-blue-100 hover:border-blue-400 rounded-2xl shadow-xs hover:shadow-md transition-all group text-center"
        >
          <div className="size-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-2">
            <Wrench className="size-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">File Complaint</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Room & Maintenance</span>
        </Link>

        <Link
          href="/dashboard/food-review"
          className="flex flex-col items-center justify-center p-3.5 bg-white border border-blue-100 hover:border-blue-400 rounded-2xl shadow-xs hover:shadow-md transition-all group text-center"
        >
          <div className="size-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-2">
            <UtensilsCrossed className="size-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Mess Review</span>
          <span className="text-[10px] text-amber-600 font-semibold mt-0.5">⭐ {avgRating} Today</span>
        </Link>
      </div>

      {/* 3. Primary Section Grid: Library Pass, Washing Machines & Live Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Library Pass Status & Fast Apply */}
        <Card className="bg-white border-slate-200 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <BookOpen className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Central Library Pass
                </CardTitle>
                <p className="text-[10px] text-slate-500">Exclusively for Campus 6 Library Visit</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold">
              Curfew 08:30 PM
            </Badge>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Pass</span>
                  <span className="text-base font-extrabold font-mono text-blue-950">
                    {latestPass?.passCode || "LIB-2026-4821"}
                  </span>
                </div>
                <Badge
                  className={`text-xs font-bold px-2.5 py-1 ${
                    latestPass?.status === "APPROVED"
                      ? "bg-blue-600 text-white"
                      : latestPass?.status === "ACTIVE"
                      ? "bg-indigo-600 text-white"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {latestPass?.status || "PENDING"}
                </Badge>
              </div>

              <div className="text-xs space-y-1 text-slate-600">
                <p>
                  <strong className="text-slate-800">Destination:</strong> {latestPass?.destination || "KIIT Central Library (Campus 6)"}
                </p>
                <p>
                  <strong className="text-slate-800">Study Window:</strong> 06:00 PM – 08:15 PM
                </p>
                <p className="text-[11px] text-slate-500">
                  Warden approval is required before biometric checkout at the hostel gate.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Link href="/dashboard/gate-pass" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-9">
                  Apply / View Library Pass
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Washing Machine Availability */}
        <Card className="bg-white border-slate-200 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <WashingIcon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Washing Machines
                </CardTitle>
                <p className="text-[10px] text-slate-500">Live Status & 1-Hr Pre-Booking</p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              {vacantMachines} / {totalMachines} Vacant
            </span>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-xs text-slate-600">
                Check machine status live from your room instead of physically walking to the laundry room:
              </p>
              <div className="space-y-1.5">
                {machines.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{m.machineNumber.split(" ")[0]}</span>
                      <span className="text-[10px] text-slate-500">{m.floor.split(" ")[0]} Flr</span>
                    </div>
                    <Badge
                      className={`text-[10px] font-bold ${
                        m.status === "VACANT"
                          ? "bg-sky-100 text-sky-800 border-sky-300"
                          : m.status === "OCCUPIED"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {m.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard/laundry" className="pt-2 block">
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold h-9">
                Pre-Book 1-Hour Slot →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 3: Digital Notice Board Preview */}
        <Card className="bg-white border-slate-200 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Megaphone className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Digital Notice Board
                </CardTitle>
                <p className="text-[10px] text-slate-500">Live Warden Broadcasts</p>
              </div>
            </div>
            <Link href="/dashboard/announcements" className="text-xs text-blue-600 font-bold hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              {notices.slice(0, 2).map((notice) => (
                <div
                  key={notice.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {notice.category.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Today</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{notice.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{notice.description}</p>
                </div>
              ))}
            </div>

            <Link href="/dashboard/announcements" className="pt-2 block">
              <Button variant="ghost" className="w-full text-slate-600 hover:text-blue-700 hover:bg-slate-100 text-xs font-semibold h-9">
                Open Reception Notice Board →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 4. Secondary Row: Student Complaints Tracker & Mess Food Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Student Complaints (Hostel, Room, Name, Roll No) */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-blue-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Student Complaints & Room Maintenance
              </CardTitle>
            </div>
            <Link href="/dashboard/complaints">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3 font-semibold">
                + New Complaint
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="text-xs text-slate-500">
              Registered with student credentials (<strong>{user.name}</strong> · Roll <strong>{user.studentProfile?.rollNo || "22051934"}</strong> · Room <strong>{user.studentProfile?.roomNo || "412"}</strong>):
            </p>

            {activeComplaints.length > 0 ? (
              <div className="space-y-2">
                {activeComplaints.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{c.title}</span>
                        <Badge className="text-[9px] uppercase bg-blue-100 text-blue-800">{c.category}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Location: {c.location} • Ticket: {c.ticketId}
                      </p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                No active complaints registered for Room {user.studentProfile?.roomNo || "412"}. Everything running smoothly!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Mess Food Review Summary */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="size-4 text-blue-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Mess Food Review & Today's Rating
              </CardTitle>
            </div>
            <Link href="/dashboard/food-review">
              <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs h-7 px-3 font-semibold">
                Submit Review
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Resident Rating</span>
                <span className="text-2xl font-black text-blue-950 flex items-center gap-1.5">
                  ⭐ {avgRating} <span className="text-xs font-normal text-slate-500">/ 5.0</span>
                </span>
              </div>
              <div className="text-right text-xs text-slate-600">
                <p className="font-semibold text-slate-800">KP-7 Central Dining Hall</p>
                <p className="text-[11px] text-slate-500">{reviews.length} Student Reviews Analyzed</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Recent Student Reviews:</p>
              {reviews.slice(0, 2).map((rev) => (
                <div key={rev.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-900">{rev.mealType} Rating</span>
                    <span className="font-bold text-amber-600">★ {rev.overallRating}.0</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 italic">"{rev.comment || "Food quality was satisfactory."}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
