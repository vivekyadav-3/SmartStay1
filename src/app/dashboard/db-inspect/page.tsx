import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Database, RefreshCw, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DbInspectorPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      studentProfile: {
        include: { hostel: true }
      }
    }
  });

  const gatePasses = await prisma.gatePass.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { studentProfile: true }
      },
      approvedBy: {
        select: { name: true, role: true }
      }
    }
  });

  const hostels = await prisma.hostel.findMany({
    include: {
      rooms: {
        include: { beds: true }
      }
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              SQLite Direct Database Viewer
            </Badge>
            <Badge variant="outline" className="text-xs">
              prisma/dev.db
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground flex items-center gap-2">
            <Database className="size-5 text-emerald-400" />
            <span>Database Inspector (Live Tables)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time tables queried straight from SQLite via Prisma Client for teacher evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Table 1: GatePass */}
      <Card className="bg-card/80 border-white/10">
        <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              1. GatePass Table ({gatePasses.length} Rows)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Primary entity showing PENDING ➔ APPROVED transitions and approvedById relation
            </p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono text-xs">
            Model: GatePass
          </Badge>
        </CardHeader>
        <CardContent className="pt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-muted-foreground uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-2 px-3">Pass Code</th>
                <th className="py-2 px-3">Student Name</th>
                <th className="py-2 px-3">Roll No</th>
                <th className="py-2 px-3">Destination</th>
                <th className="py-2 px-3">Purpose</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Approved By</th>
                <th className="py-2 px-3">Return Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gatePasses.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 font-mono">
                  <td className="py-2.5 px-3 font-bold text-amber-400">{p.passCode}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-foreground">{p.user?.name || "N/A"}</td>
                  <td className="py-2.5 px-3 text-emerald-300">{p.user?.studentProfile?.rollNo || "N/A"}</td>
                  <td className="py-2.5 px-3 font-sans text-muted-foreground">{p.destination}</td>
                  <td className="py-2.5 px-3 font-sans text-muted-foreground max-w-xs truncate">{p.purpose}</td>
                  <td className="py-2.5 px-3">
                    <Badge
                      className={`text-[10px] font-bold ${
                        p.status === "APPROVED"
                          ? "bg-emerald-600 text-white"
                          : p.status === "REJECTED"
                          ? "bg-rose-600 text-white"
                          : "bg-amber-500 text-slate-950"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    {p.approvedBy ? (
                      <span className="text-emerald-400 font-semibold">{p.approvedBy.name}</span>
                    ) : (
                      <span className="text-muted-foreground italic">null (Pending)</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {p.returnTime ? new Date(p.returnTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "08:30 PM"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Table 2: User */}
      <Card className="bg-card/80 border-white/10">
        <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              2. User Table ({users.length} Seeded Demo Accounts)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Core user records with mapped Role (STUDENT / WARDEN / SECURITY)
            </p>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-mono text-xs">
            Model: User
          </Badge>
        </CardHeader>
        <CardContent className="pt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-muted-foreground uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Biometric Status</th>
                <th className="py-2 px-3">Roll No</th>
                <th className="py-2 px-3">Hostel & Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.slice(0, 10).map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-semibold text-foreground">{u.name}</td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono font-bold ${
                        u.role === "WARDEN"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : u.role === "SECURITY"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">
                    {u.biometricStatus || "IN_HOSTEL"}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-300">
                    {u.studentProfile?.rollNo || "—"}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {u.studentProfile ? `${u.studentProfile.hostel?.code || "KP-7"} - Rm ${u.studentProfile.roomNo}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-muted-foreground italic pt-2">
            * Showing 10 key demonstration rows (5 group members + demo cohort)
          </p>
        </CardContent>
      </Card>

      {/* Table 3: StudentProfile & Hostel */}
      <Card className="bg-card/80 border-white/10">
        <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              3. StudentProfile & Hostel Relations
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Normalized relational schema: User ➔ StudentProfile ➔ Hostel ➔ Room ➔ Bed
            </p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-mono text-xs">
            Model: StudentProfile
          </Badge>
        </CardHeader>
        <CardContent className="pt-4 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hostels.map((h) => (
              <div key={h.id} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{h.name}</span>
                  <Badge variant="outline" className="text-xs">{h.code}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Campus: {h.campus}</p>
                <div className="text-[11px] text-emerald-400 font-mono pt-1">
                  Total Allocated Rooms: {h.rooms.length} | Beds: {h.rooms.reduce((acc, r) => acc + r.beds.length, 0)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
