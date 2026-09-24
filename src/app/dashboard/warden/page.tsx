"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  ShieldAlert, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Wrench, 
  FileCheck2, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Building,
  Phone,
  Calendar,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPendingGatePasses, approveGatePass, rejectGatePass } from "@/app/actions/gate-pass";

interface PendingPass {
  id: string;
  passCode?: string;
  passNumber?: string;
  destination: string;
  purpose: string;
  departureTime?: string | Date;
  returnTime?: string | Date;
  outTime?: string | Date;
  expectedInTime?: string | Date;
  status: string;
  curfewDeadline: string;
  wardenRemark?: string | null;
  user?: {
    name?: string | null;
    studentProfile?: {
      rollNo?: string | null;
      roomNo?: string | null;
      bedNo?: string | null;
      phone?: string | null;
      hostel?: { name?: string | null } | null;
    } | null;
    rollNo?: string | null;
    hostelName?: string | null;
    roomNo?: string | null;
    phone?: string | null;
  };
}

function formatPassTime(time: string | Date | undefined) {
  if (!time) return "06:15 PM";
  if (typeof time === "string") return time;
  try {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "06:15 PM";
  }
}

const fallbackPendingPasses: PendingPass[] = [
  {
    id: "pass-pend-1",
    passCode: "GP-2026-0812",
    passNumber: "GP-2026-0812",
    destination: "KIIT Central Library (Campus 6)",
    purpose: "3rd-year semester capstone project research and group coding",
    outTime: "06:15 PM",
    expectedInTime: "08:30 PM",
    status: "PENDING",
    curfewDeadline: "08:30 PM",
    user: {
      name: "Vivek Yadav",
      rollNo: "22051934",
      hostelName: "King's Palace 7",
      roomNo: "412 (Bed B)",
      phone: "+91 98765 43210",
    },
  },
  {
    id: "pass-pend-2",
    passCode: "GP-2026-9041",
    passNumber: "GP-2026-9041",
    destination: "KIMS Hospital (Campus 5)",
    purpose: "Routine orthopedic follow-up & physiotherapy session",
    outTime: "05:00 PM",
    expectedInTime: "07:30 PM",
    status: "PENDING",
    curfewDeadline: "08:30 PM",
    user: {
      name: "Ayush Sharma",
      rollNo: "22051410",
      hostelName: "King's Palace 7",
      roomNo: "318 (Bed A)",
      phone: "+91 98612 88771",
    },
  },
  {
    id: "pass-pend-3",
    passCode: "GP-2026-4421",
    passNumber: "GP-2026-4421",
    destination: "Campus 12 Food Court & Gym",
    purpose: "Evening fitness training & project discussion",
    outTime: "06:30 PM",
    expectedInTime: "08:15 PM",
    status: "PENDING",
    curfewDeadline: "08:30 PM",
    user: {
      name: "Rahul Kumar",
      rollNo: "22051882",
      hostelName: "King's Palace 7",
      roomNo: "205 (Bed C)",
      phone: "+91 94371 55442",
    },
  },
];

export default function WardenDashboardPage() {
  const [pendingPasses, setPendingPasses] = useState<PendingPass[]>(fallbackPendingPasses);
  const [activeTab, setActiveTab] = useState<"PASSES" | "OUTINGS" | "COMPLAINTS">("PASSES");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadData() {
      try {
        const passes = await getPendingGatePasses();
        if (passes && passes.length > 0) {
          setPendingPasses(
            passes.map((p: any) => ({
              ...p,
              passNumber: p.passCode || p.passNumber,
              outTime: p.departureTime || p.outTime,
              expectedInTime: p.returnTime || p.expectedInTime,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load pending passes:", err);
      }
    }
    loadData();
  }, []);

  const handleApprove = (passId: string, passNo: string, studentName?: string | null) => {
    startTransition(async () => {
      await approveGatePass(passId);
      setPendingPasses((prev) =>
        prev.map((p) => (p.id === passId ? { ...p, status: "APPROVED" } : p))
      );
      setActionNotice(
        `Gate Pass ${passNo} for ${studentName || "Resident"} has been APPROVED. QR is now valid for Security Gate scan.`
      );
      setTimeout(() => setActionNotice(null), 6000);
    });
  };

  const handleReject = (passId: string, passNo: string, studentName?: string | null) => {
    startTransition(async () => {
      await rejectGatePass(passId, "Rejected: Please consult Chief Warden Office in person.");
      setPendingPasses((prev) =>
        prev.map((p) => (p.id === passId ? { ...p, status: "REJECTED" } : p))
      );
      setActionNotice(`Gate Pass ${passNo} for ${studentName || "Resident"} has been REJECTED.`);
      setTimeout(() => setActionNotice(null), 6000);
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
              Hostel Administration
            </Badge>
            <Badge variant="outline" className="text-xs">
              KP-7 Chief Warden Portal
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Warden Oversight Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Superintendent: <strong>Prof. S. K. Mohapatra</strong> • King's Palace 7 (Campus 12)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/dashboard/security-gate"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold transition-all"
          >
            <span>Live Security Gate</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Overview Grid (User specified numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-1 pt-3.5 px-4">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Residents
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <span className="text-2xl font-bold font-mono text-foreground">1,284</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">KP-7 Enrolled</span>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-1 pt-3.5 px-4">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Inside Hostel
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <span className="text-2xl font-bold font-mono text-emerald-400">1,198</span>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5">Biometric Punched IN</span>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-1 pt-3.5 px-4">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Currently Outside
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <span className="text-2xl font-bold font-mono text-amber-400">86</span>
            <span className="text-[10px] text-amber-400/80 block mt-0.5">Active Gate Passes</span>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-1 pt-3.5 px-4">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Late Curfew Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <span className="text-2xl font-bold font-mono text-rose-400">12</span>
            <span className="text-[10px] text-rose-400/80 block mt-0.5">Beyond 08:30 PM</span>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-white/10 col-span-2 sm:col-span-1">
          <CardHeader className="pb-1 pt-3.5 px-4">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Open Complaints
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <span className="text-2xl font-bold font-mono text-blue-400">37</span>
            <span className="text-[10px] text-blue-400/80 block mt-0.5">Active Maintenance</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("PASSES")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "PASSES"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCheck2 className="size-4" />
          <span>Pending Gate Passes ({pendingPasses.filter((p) => p.status === "PENDING").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("OUTINGS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "OUTINGS"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="size-4" />
          <span>Active Outing Roster (86 Outside)</span>
        </button>

        <button
          onClick={() => setActiveTab("COMPLAINTS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "COMPLAINTS"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wrench className="size-4" />
          <span>Maintenance Oversight (37 Tickets)</span>
        </button>
      </div>

      {/* Tab 1: Gate Pass Approvals Queue */}
      {activeTab === "PASSES" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              Review Resident Gate Pass Requests
            </h3>
            <span className="text-xs text-muted-foreground">
              Approved passes are automatically pushed to Security Turnstiles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPasses.map((pass) => (
              <Card
                key={pass.id}
                className={`bg-card/80 border transition-all ${
                  pass.status === "APPROVED"
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : pass.status === "REJECTED"
                    ? "border-rose-500/40 bg-rose-950/10"
                    : "border-white/10 hover:border-amber-500/40"
                }`}
              >
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {pass.passNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          pass.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : pass.status === "REJECTED"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {pass.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground mt-1">
                      {pass.user?.name || "Vivek Yadav"}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground font-mono">
                      Roll: {pass.user?.studentProfile?.rollNo || pass.user?.rollNo || "22051934"} • Room {pass.user?.studentProfile?.roomNo || pass.user?.roomNo || "412"}
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-muted-foreground">
                    <span className="block font-semibold text-foreground">Outing Window</span>
                    <span className="font-mono text-emerald-400">{formatPassTime(pass.outTime)}</span>
                    <span className="block text-[10px] text-amber-400 font-mono">
                      Must return by {pass.curfewDeadline}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Destination:</span>
                      <span className="font-bold text-foreground">{pass.destination}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground pt-1">
                      <strong>Purpose:</strong> {pass.purpose}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-white/5">
                      <span>Emergency Phone:</span>
                      <span className="font-mono text-foreground">{pass.user?.studentProfile?.phone || pass.user?.phone || "+91 98765 43210"}</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  {pass.status === "PENDING" ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        onClick={() => handleApprove(pass.id, pass.passNumber || pass.passCode || "GP-2026-0812", pass.user?.name)}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 h-9"
                      >
                        <Check className="size-4" />
                        <span>APPROVE PASS</span>
                      </Button>
                      <Button
                        onClick={() => handleReject(pass.id, pass.passNumber || pass.passCode || "GP-2026-0812", pass.user?.name)}
                        disabled={isPending}
                        variant="outline"
                        className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 font-bold text-xs gap-1.5 h-9"
                      >
                        <X className="size-4" />
                        <span>REJECT</span>
                      </Button>
                    </div>
                  ) : pass.status === "APPROVED" ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-4" />
                        <span>Authorized by Warden Office</span>
                      </div>
                      <a
                        href={`/dashboard/security-gate?pass=${pass.passNumber}`}
                        className="underline text-[11px] hover:text-white"
                      >
                        Scan at Gate &rarr;
                      </a>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
                      Rejected by Warden
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Active Outings Roster */}
      {activeTab === "OUTINGS" && (
        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
              <span>Residents Outside KP-7 Campus</span>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                Curfew In-Time: 08:30 PM
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] text-muted-foreground uppercase border-b border-white/10 bg-white/5 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Roll & Room</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Out-Time</th>
                    <th className="py-2.5 px-3">Expected Return</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-semibold text-foreground">Vivek Yadav</td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">22051934 • Room 412</td>
                    <td className="py-2.5 px-3 text-muted-foreground">KIIT Central Library</td>
                    <td className="py-2.5 px-3 font-mono">06:15 PM</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">08:30 PM</td>
                    <td className="py-2.5 px-3 font-mono">+91 98765 43210</td>
                    <td className="py-2.5 px-3">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                        ON TRACK
                      </Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-semibold text-foreground">Subham Biswal</td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">22050811 • Room 104</td>
                    <td className="py-2.5 px-3 text-muted-foreground">Campus 15 Sports Complex</td>
                    <td className="py-2.5 px-3 font-mono">05:30 PM</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">08:00 PM</td>
                    <td className="py-2.5 px-3 font-mono">+91 98611 11223</td>
                    <td className="py-2.5 px-3">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                        ON TRACK
                      </Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-semibold text-foreground">Priyanshu Dash</td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">22053120 • Room 521</td>
                    <td className="py-2.5 px-3 text-muted-foreground">Patia Market (Personal)</td>
                    <td className="py-2.5 px-3 font-mono">04:45 PM</td>
                    <td className="py-2.5 px-3 font-mono text-rose-400">07:45 PM</td>
                    <td className="py-2.5 px-3 font-mono">+91 97780 44332</td>
                    <td className="py-2.5 px-3">
                      <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px]">
                        LATE RETURN
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Complaints Oversight */}
      {activeTab === "COMPLAINTS" && (
        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground">
              Hostel Facility & Maintenance Dispatch Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                id: "KIIT-KP7-1001",
                title: "AC Not Cooling & Filter Choked",
                room: "Room 412 (Vivek Yadav)",
                category: "ELECTRICAL",
                tech: "Ramesh Behera (KP-7 Electrician)",
                otp: "4829",
                status: "IN_PROGRESS",
              },
              {
                id: "KIIT-KP7-1002",
                title: "Bathroom Tap Leakage & Water Pressure Low",
                room: "Room 308 (Floor 3)",
                category: "PLUMBING",
                tech: "Pradeep Sahoo (Plumber)",
                otp: "8120",
                status: "ASSIGNED",
              },
              {
                id: "KIIT-KP7-1003",
                title: "Ceiling Geyser Thermostat Tripping",
                room: "Room 514 (Floor 5)",
                category: "ELECTRICAL",
                tech: "Ramesh Behera (KP-7 Electrician)",
                otp: "9931",
                status: "PENDING",
              },
            ].map((ticket) => (
              <div
                key={ticket.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{ticket.id}</span>
                    <Badge variant="outline" className="text-[10px]">{ticket.category}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mt-0.5">{ticket.title}</h4>
                  <span className="text-xs text-muted-foreground">{ticket.room}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-muted-foreground block">
                    Technician: <strong>{ticket.tech}</strong>
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">
                    Resolution OTP: [{ticket.otp}]
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
