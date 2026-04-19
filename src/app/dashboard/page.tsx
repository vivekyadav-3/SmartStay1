import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareWarning, CalendarClock, UserSquare2, Home, ArrowRight, Activity } from "lucide-react";
import { redirect } from "next/navigation";
import { syncUser, getAdminStats } from "@/app/actions/user";
import { getNotices } from "@/app/actions/notices";
import RoomSelector from "@/components/dashboard/room-selector";
import NoticeBoard from "@/components/dashboard/notice-board";
import AdminCharts from "@/components/dashboard/admin-charts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await syncUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Home className="size-12 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">Welcome to SmartStay!</h2>
        <p className="text-muted-foreground max-w-sm">Setting up your dashboard...</p>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const adminStats = isAdmin ? await getAdminStats() : null;
  const notices = await getNotices();

  const activeComplaintsCount = await prisma.complaint.count({
    where: isAdmin ? { status: "PENDING" } : { userId: user.id, status: "PENDING" }
  });

  const nextLaundry = await prisma.laundryBooking.findFirst({
    where: isAdmin ? { date: { gte: new Date() } } : { userId: user.id, date: { gte: new Date() } },
    orderBy: { date: "asc" }
  });

  const lastVisitor = await prisma.visitorPass.findFirst({
    where: isAdmin ? {} : { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  const recentComplaints = await prisma.complaint.findMany({
    where: isAdmin ? {} : { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: isAdmin ? { user: { select: { name: true } } } : undefined
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
              {isAdmin ? "Admin Analytics" : `Welcome back, ${user.name || "Student"}`}
          </h1>
          <p className="text-muted-foreground mt-1">
             {isAdmin ? "Warden Strategic Portal" : `Room: ${user.roomNo || "Not Assigned"}`} • {user.email}
          </p>
        </div>
      </div>

      {!isAdmin && <RoomSelector currentRoom={user.roomNo} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/complaints" className="group">
            <Card className="bg-black/20 border-white/10 backdrop-blur-md transition-all hover:bg-white/5 hover:border-orange-500/50 hover:scale-[1.02] active:scale-[0.98]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {isAdmin ? "Open Tickets" : "Active Complaints"}
                </CardTitle>
                <MessageSquareWarning className="size-4 text-orange-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{activeComplaintsCount}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 group-hover:text-orange-400 transition-colors">
                    {isAdmin ? "Critical attention needed" : "Pending resolution"} <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
            </CardContent>
            </Card>
        </Link>
        
        <Link href="/dashboard/laundry" className="group">
            <Card className="bg-black/20 border-white/10 backdrop-blur-md transition-all hover:bg-white/5 hover:border-blue-500/50 hover:scale-[1.02] active:scale-[0.98]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {isAdmin ? "Machine Load" : "Next Laundry"}
                </CardTitle>
                <CalendarClock className="size-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold truncate">
                {isAdmin ? `${adminStats?.laundryToday} Bookings` : (nextLaundry ? new Date(nextLaundry.date).toLocaleDateString() : "No Bookings")}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                {isAdmin ? "Real-time occupancy" : (nextLaundry ? nextLaundry.slot : "Book a slot")} <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
            </CardContent>
            </Card>
        </Link>

        <Link href="/dashboard/visitor-pass" className="group">
            <Card className="bg-black/20 border-white/10 backdrop-blur-md transition-all hover:bg-white/5 hover:border-purple-500/50 hover:scale-[1.02] active:scale-[0.98]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {isAdmin ? "Gate Security" : "Visitor Status"}
                </CardTitle>
                <UserSquare2 className="size-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold">
                {isAdmin ? `${adminStats?.pendingVisitors} Pending` : (lastVisitor ? lastVisitor.visitorName : "No Requests")}
                </div>
                <div className="mt-1 flex items-center justify-between">
                {isAdmin ? (
                    <p className="text-xs text-muted-foreground group-hover:text-purple-400 transition-colors">Awaiting Gate Clearance</p>
                ) : lastVisitor ? (
                    <Badge variant="outline" className={`text-[10px] uppercase h-5 ${
                    lastVisitor.status === 'APPROVED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                    lastVisitor.status === 'REJECTED' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                    'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                    {lastVisitor.status}
                    </Badge>
                ) : (
                    <p className="text-xs text-muted-foreground group-hover:text-purple-400 transition-colors">Request a pass</p>
                )}
                <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                </div>
            </CardContent>
            </Card>
        </Link>
      </div>

      {isAdmin && <AdminCharts data={adminStats} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NoticeBoard notices={notices} role={user.role} />

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                <Activity className="size-4 text-orange-400" />
                <CardTitle className="text-lg">Recent Feed</CardTitle>
            </div>
            <Link href="/dashboard/complaints">
                <Button variant="outline" size="sm" className="text-xs h-7 gap-1 border-white/10 hover:bg-white/5">
                    History <ArrowRight className="size-3" />
                </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComplaints.length === 0 && <p className="text-sm text-muted-foreground">No updates available.</p>}
              {recentComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="truncate pr-4">
                    <p className="font-medium truncate text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                        {isAdmin && (c as any).user?.name ? `${(c as any).user.name} • ` : ""}
                        {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-[10px] h-5 ${c.status === "PENDING" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
