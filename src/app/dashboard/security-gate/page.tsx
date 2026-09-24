"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building, 
  Phone, 
  Fingerprint,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGatePassByNumber, securityPunchPass, getRecentGateLogs } from "@/app/actions/gate-pass";

interface GatePassData {
  id: string;
  passCode: string;
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
    id: string;
    name: string | null;
    biometricStatus: string;
    studentProfile?: {
      rollNo?: string | null;
      roomNo?: string | null;
      bedNo?: string | null;
      branch?: string | null;
      phone?: string | null;
      hostel?: {
        name?: string | null;
      } | null;
    } | null;
    rollNo?: string | null;
    hostelName?: string | null;
    roomNo?: string | null;
    bedNo?: string | null;
    branch?: string | null;
    phone?: string | null;
  };
}

export default function SecurityGatePage() {
  const searchParams = useSearchParams();
  const initialPassParam = searchParams.get("pass") || "GP-2026-0812";

  const [passQuery, setPassQuery] = useState(initialPassParam);
  const [currentPass, setCurrentPass] = useState<GatePassData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [punchMessage, setPunchMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const [recentPunches, setRecentPunches] = useState<any[]>([]);

  const refreshLogs = async () => {
    try {
      const logs = await getRecentGateLogs();
      if (logs && logs.length > 0) {
        setRecentPunches(
          logs.map((l) => ({
            id: l.id,
            student: l.user?.name || "Student",
            rollNo: l.user?.studentProfile?.rollNo || "22051934",
            action: l.action,
            destination: l.pass?.destination || "Campus 12 Area",
            time: new Date(l.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "VERIFIED",
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadPass = async (passNo: string) => {
    setIsLoading(true);
    setPunchMessage(null);
    try {
      const pass = await getGatePassByNumber(passNo);
      if (pass) {
        setCurrentPass(pass as any);
      } else {
        // Fallback demo pass if DB doesn't have it yet
        setCurrentPass({
          id: "demo-gp-0812",
          passCode: passNo.toUpperCase(),
          destination: "KIIT Central Library (Campus 6)",
          purpose: "3rd-year semester capstone project research and group coding",
          outTime: new Date().toISOString(),
          expectedInTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: "APPROVED",
          curfewDeadline: "08:30 PM",
          wardenRemark: "Approved by Prof. S. K. Mohapatra (Chief Warden KP-7)",
          user: {
            id: "student_vivek_22051934",
            name: "Vivek Yadav",
            biometricStatus: "IN_HOSTEL",
            studentProfile: {
              rollNo: "22051934",
              roomNo: "412",
              bedNo: "B",
              branch: "Computer Science & Engineering",
              phone: "+91 98765 43210",
              hostel: { name: "King's Palace 7" },
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPass(passQuery);
    refreshLogs();
  }, []);

  const handlePunchAction = (action: "OUT" | "IN") => {
    if (!currentPass) return;
    const targetPassCode = currentPass.passCode || currentPass.passNumber || "GP-2026-0812";
    startTransition(async () => {
      const res = await securityPunchPass(targetPassCode, action);
      if (res.error) {
        setPunchMessage({ text: res.error, type: "error" });
      } else {
        setPunchMessage({ text: res.message || "Biometric turnstile verified!", type: "success" });
        if (currentPass) {
          setCurrentPass({
            ...currentPass,
            status: action === "OUT" ? "ACTIVE" : "COMPLETED",
            user: currentPass.user
              ? {
                  ...currentPass.user,
                  biometricStatus: action === "OUT" ? "OUTSIDE_CAMPUS" : "IN_HOSTEL",
                }
              : undefined,
          });
          await refreshLogs();
        }
      }
    });
  };

  const isResidentOut =
    currentPass?.user?.biometricStatus === "OUTSIDE_CAMPUS" ||
    currentPass?.status === "OUTSIDE";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
              Security Gate Terminal
            </Badge>
            <Badge variant="outline" className="text-xs">
              KP-7 Turnstiles • Officer R. K. Swain
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Security Gate & Pass Checkpoint
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Scan resident RFID QR codes, verify warden digital authorization, and record turnstile punch IN / OUT.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
          <span className="size-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-semibold text-blue-300">Biometric Gate Online</span>
        </div>
      </div>

      {/* Quick Lookup Bar */}
      <Card className="bg-card/70 border-white/10 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadPass(passQuery);
              }}
              className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={passQuery}
                  onChange={(e) => setPassQuery(e.target.value.toUpperCase())}
                  placeholder="Scan or enter Pass ID (e.g. GP-2026-0812)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-blue-500"
                />
              </div>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9">
                Lookup Pass
              </Button>
            </form>

            {/* Quick Demo Shortcuts */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">Quick Select:</span>
              <button
                type="button"
                onClick={() => {
                  setPassQuery("GP-2026-0812");
                  loadPass("GP-2026-0812");
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-500/20 text-xs font-mono border border-white/10 hover:border-blue-500/40 text-foreground transition-all"
              >
                Vivek Yadav (GP-2026-0812)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Alert */}
      {punchMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
            punchMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/40 text-rose-300"
          }`}
        >
          {punchMessage.type === "success" ? (
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{punchMessage.text}</span>
        </div>
      )}

      {/* Main Split: Pass Verification Card & Gate Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: The Official Digital Pass Verification Card */}
        <div className="lg:col-span-7">
          <Card className="bg-gradient-to-br from-card via-card/95 to-slate-900 border border-blue-500/30 shadow-2xl relative overflow-hidden">
            {/* Top Pass Header Banner */}
            <div className="bg-slate-950/90 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xs">
                  KIIT
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
                    Kalinga Institute of Industrial Technology
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    King's Palace 7 • Digital Outing & Curfew Gate Pass
                  </p>
                </div>
              </div>

              <Badge
                className={`font-mono text-[11px] font-bold ${
                  currentPass?.status === "REJECTED"
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    : isResidentOut
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {isResidentOut ? "● OUTSIDE CAMPUS" : "✓ VALID & AUTHORIZED"}
              </Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Pass ID & Student Profile Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                    VY
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                      Resident Student
                    </span>
                    <h4 className="text-base font-bold text-foreground">
                      {currentPass?.user?.name || "Vivek Yadav"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400">
                      Roll No: {currentPass?.user?.studentProfile?.rollNo || currentPass?.user?.rollNo || "22051934"}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                    Hostel & Room
                  </span>
                  <span className="text-xs font-semibold text-foreground block">
                    {currentPass?.user?.studentProfile?.hostel?.name || currentPass?.user?.hostelName || "King's Palace 7"}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Room {currentPass?.user?.studentProfile?.roomNo || currentPass?.user?.roomNo || "412"} • Bed {currentPass?.user?.studentProfile?.bedNo || currentPass?.user?.bedNo || "B"}
                  </span>
                </div>
              </div>

              {/* Destination & Timing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                    Destination
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {currentPass?.destination || "KIIT Central Library (Campus 6)"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Purpose: {currentPass?.purpose || "Research & Study"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Approved Out-Time:</span>
                    <span className="font-mono font-bold text-foreground">06:15 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Curfew Return Deadline:</span>
                    <span className="font-mono font-bold text-amber-400">08:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Authorized By:</span>
                    <span className="font-semibold text-emerald-400">Chief Warden KP-7</span>
                  </div>
                </div>
              </div>

              {/* Pass Number & Security Stamp */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-muted-foreground font-mono">
                <span>Pass: <strong>{currentPass?.passCode || currentPass?.passNumber || "GP-2026-0812"}</strong></span>
                <span>Verification: <strong>BIOMETRIC_OK</strong></span>
                <span>Gate: <strong>KP-7 Main</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Security Officer Controls & Turnstile Actions */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-card/80 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Fingerprint className="size-4 text-blue-400" />
                <span>Turnstile Verification & Biometric Punch</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Status Box */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                  Current Resident Location State
                </span>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span
                    className={`size-3 rounded-full ${
                      isResidentOut ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                    }`}
                  />
                  <span
                    className={`text-base font-extrabold font-mono ${
                      isResidentOut ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {isResidentOut ? "OUTSIDE CAMPUS" : "HOSTEL IN-CAMPUS"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  {isResidentOut
                    ? "Student is currently outside KP-7. Ready for Return Punch."
                    : "Student is inside hostel. Ready for Outing Punch."}
                </p>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="space-y-2.5">
                {!isResidentOut ? (
                  <Button
                    onClick={() => handlePunchAction("OUT")}
                    disabled={isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 text-sm gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <ArrowUpRight className="size-5" />
                    <span>🟢 VERIFY & PUNCH OUT FOR OUTING</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePunchAction("IN")}
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-sm gap-2 shadow-lg shadow-blue-600/30"
                  >
                    <ArrowDownLeft className="size-5" />
                    <span>🔵 VERIFY & PUNCH IN (RETURN TO HOSTEL)</span>
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePunchAction("OUT")}
                    disabled={isPending}
                    className="text-[11px] border-white/10 hover:border-emerald-500/40"
                  >
                    Force Punch OUT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePunchAction("IN")}
                    disabled={isPending}
                    className="text-[11px] border-white/10 hover:border-blue-500/40"
                  >
                    Force Punch IN
                  </Button>
                </div>
              </div>

              {/* Security Officer Note */}
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300 leading-relaxed">
                <strong>Officer Protocol:</strong> Ensure student's face matches the digital pass record and that biometric fingerprint matches Roll <strong>{currentPass?.user?.rollNo || "22051934"}</strong> before granting turnstile passage.
              </div>
            </CardContent>
          </Card>

          {/* Quick link to student dashboard */}
          <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
            <span>Check student perspective:</span>
            <a
              href="/dashboard"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Dashboard Updates</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom: Recent Security Checkpoint Log Table */}
      <Card className="bg-card/70 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-emerald-400" />
              <span>Turnstile Punch Log (Today • KP-7 Gate)</span>
            </div>
            <span className="text-xs text-muted-foreground font-normal">Real-time Stream</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-muted-foreground uppercase border-b border-white/10 bg-white/5 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll Number</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentPunches.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-foreground">{item.student}</td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">{item.rollNo}</td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          item.action === "PUNCH_OUT"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {item.action === "PUNCH_OUT" ? "↗ PUNCH OUT" : "↙ PUNCH IN"}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">{item.destination}</td>
                    <td className="py-2.5 px-3 font-mono text-foreground">{item.time}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
