"use client";

import { useState } from "react";
import { 
  Clock, 
  UtensilsCrossed, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Fingerprint,
  PlusCircle,
  Building2,
  FileCheck2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requestGatePass } from "@/app/actions/gate-pass";
import { toggleBiometricPunch } from "@/app/actions/user";

export default function TimingsPage() {
  const [biometricStatus, setBiometricStatus] = useState<string>("IN_HOSTEL");
  const [isPunching, setIsPunching] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  // Form states for gate pass
  const [destination, setDestination] = useState("KIIT Central Library (Campus 6)");
  const [purpose, setPurpose] = useState("Semester capstone project research & group coding lab");
  const [passType, setPassType] = useState("LIBRARY");
  const [hours, setHours] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<{
    passNumber: string;
    destination: string;
    purpose: string;
    outTime: string;
    expectedInTime: string;
    status: string;
  } | null>(null);

  const handlePunch = async () => {
    setIsPunching(true);
    // toggle
    setBiometricStatus(prev => (prev === "IN_HOSTEL" || prev === "IN" ? "OUTSIDE_CAMPUS" : "IN_HOSTEL"));
    setTimeout(() => setIsPunching(false), 500);
  };

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await requestGatePass({
      passType,
      destination,
      purpose,
      expectedInTimeHours: Number(hours),
    });

    if (res.success && res.gatePass) {
      setGeneratedPass({
        passNumber: (res.gatePass as any).passCode || (res.gatePass as any).passNumber,
        destination: res.gatePass.destination,
        purpose: res.gatePass.purpose,
        outTime: new Date((res.gatePass as any).departureTime || (res.gatePass as any).outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expectedInTime: new Date((res.gatePass as any).returnTime || (res.gatePass as any).expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: res.gatePass.status,
      });
      setShowPassModal(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              KIIT Hostel Administration
            </Badge>
            <Badge variant="outline" className="text-xs">
              KP-7 & QC Wing Timings
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Hostel & Mess Timings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mess operating schedules, gate curfew, biometric in-time and digital outing pass.
          </p>
        </div>

        <Button 
          onClick={() => setShowPassModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/20 text-xs"
        >
          <PlusCircle className="size-4" />
          <span>Apply Digital Gate Pass</span>
        </Button>
      </div>

      {/* Curfew Live Alert Status Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-card/70 to-card/90 border border-emerald-500/20 p-5 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-emerald-500 animate-pulse" />
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs">
                GATES OPEN • NORMAL IN/OUT
              </Badge>
              <span className="text-xs text-muted-foreground">• In-time: <strong>08:30 PM</strong></span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Nightly Curfew Deadline: 08:30 PM
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              All resident students must record biometric punch at King's Palace main gate prior to 08:30 PM. For library or project extensions, carry an approved digital gate pass.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Live Biometric Punch */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center w-full sm:w-auto">
              <span className="text-[11px] text-muted-foreground block">Resident State:</span>
              <span className={`text-sm font-bold font-mono ${biometricStatus === "OUTSIDE_CAMPUS" || biometricStatus === "OUT" ? "text-amber-400" : "text-emerald-400"}`}>
                {biometricStatus === "OUTSIDE_CAMPUS" || biometricStatus === "OUT" ? "OUTSIDE CAMPUS" : "HOSTEL IN-CAMPUS"}
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                {biometricStatus === "OUTSIDE_CAMPUS" || biometricStatus === "OUT" ? "Out on Pass • Curfew 08:30 PM" : "Normal Resident Status"}
              </span>
            </div>

            <Button
              onClick={handlePunch}
              disabled={isPunching}
              variant="outline"
              className="w-full sm:w-auto gap-2 border-emerald-500/40 text-xs h-11"
            >
              <Fingerprint className="size-4 text-emerald-400" />
              <span>{biometricStatus === "OUTSIDE_CAMPUS" || biometricStatus === "OUT" ? "Punch IN at Gate" : "Punch OUT for Outing"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Mess Timings + Gate Curfew Timings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Mess Timings Card */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <UtensilsCrossed className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Hostel Mess Timings</CardTitle>
                  <p className="text-xs text-muted-foreground">Operating hours for Central Dining Hall</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                Active Schedule
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              {/* Breakfast */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">1. Breakfast</span>
                  <span className="text-xs text-muted-foreground">Idli, Parathas, Boiled Eggs, Tea, Milk</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">07:30 AM - 09:30 AM</span>
                  <span className="text-[10px] text-muted-foreground">Morning Session</span>
                </div>
              </div>

              {/* Lunch */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">2. Lunch</span>
                  <span className="text-xs text-muted-foreground">Rice, Roti, Dal, Paneer/Chicken/Fish, Curd</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">12:30 PM - 02:30 PM</span>
                  <span className="text-[10px] text-muted-foreground">Afternoon Session</span>
                </div>
              </div>

              {/* Evening Snacks */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">3. Evening Snacks</span>
                  <span className="text-xs text-muted-foreground">Samosa, Cutlet, Sandwiches, Hot Chai</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">05:00 PM - 06:30 PM</span>
                  <span className="text-[10px] text-muted-foreground">Evening Session</span>
                </div>
              </div>

              {/* Dinner */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    4. Dinner
                    <Badge className="bg-emerald-500 text-slate-950 font-bold text-[9px] h-4">UPCOMING</Badge>
                  </span>
                  <span className="text-xs text-muted-foreground">Pulao, Naan, Dal Makhani, Curries, Sweets</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">07:30 PM - 09:45 PM</span>
                  <span className="text-[10px] text-emerald-300">Night Session</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic border-t border-white/5 pt-3">
              * Dining hall access requires valid KIIT Resident ID verification at turnstile scanner.
            </p>
          </CardContent>
        </Card>

        {/* Right: Entry, Exit & Curfew Timings */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Clock className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Hostel Entry & Exit Rules</CardTitle>
                  <p className="text-xs text-muted-foreground">Campus 12 King's Palace security protocol</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]">
                Strict Biometric
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              {/* Morning Gate Opening */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">Morning Gate Opening</span>
                  <span className="text-xs text-muted-foreground">Free movement across Campus & KIIT Sports Stadium</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400">06:00 AM</span>
              </div>

              {/* General In-Time Curfew */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">Standard Hostel Curfew (In-Time)</span>
                  <span className="text-xs text-muted-foreground">Mandatory biometric attendance for all residents</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">08:30 PM</span>
              </div>

              {/* Late Entry Grace Window */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">Late Entry with Gate Pass</span>
                  <span className="text-xs text-muted-foreground">Library, project lab, or medical justification required</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">09:30 PM Max</span>
              </div>

              {/* Night Curfew Gate Lock */}
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-300 block">Night Lockdown</span>
                  <span className="text-xs text-muted-foreground">Main gates shut. Security patrol active</span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">10:00 PM - 06:00 AM</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Chief Warden Penalty Advisory</span>
              </span>
              <p className="text-[11px] text-muted-foreground">
                Repeated late entries beyond 08:30 PM without digital gate pass will result in automatic parental SMS notification via KIIT SAP Portal and ₹500 disciplinary fee.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Digital Outing Gate Pass Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileCheck2 className="size-5 text-emerald-400" />
            <span>Digital Outing Pass & Gate Verification</span>
          </h3>
          <Button 
            onClick={() => setShowPassModal(true)}
            size="sm" 
            variant="outline" 
            className="text-xs h-8 border-white/10 hover:border-emerald-500/40"
          >
            + New Request
          </Button>
        </div>

        {/* Active Digital Gate Pass Display Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card/90 to-emerald-950/30 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Pass Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-bold text-xs">
                  VERIFIED DIGITAL PASS
                </Badge>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {generatedPass?.passNumber || "GP-2026-0812"}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-bold text-foreground">
                  {generatedPass?.destination || "KIIT Central Library (Campus 6)"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Purpose: {generatedPass?.purpose || "3rd-year semester capstone project research and group coding"}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block">Out Time</span>
                  <span className="text-xs font-bold text-foreground">{generatedPass?.outTime || "06:15 PM"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block">Must Return Before</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{generatedPass?.expectedInTime || "08:15 PM"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block">Authorization</span>
                  <span className="text-xs font-bold text-emerald-400">Warden KP-7</span>
                </div>
              </div>
            </div>

            {/* Right: QR Code Visual for Gate Security Scanner */}
            <div className="flex flex-col items-center justify-center p-4 bg-black/60 rounded-xl border border-white/10 text-center">
              <a
                href={`/dashboard/security-gate?pass=${generatedPass?.passNumber || "GP-2026-0812"}`}
                title="Click to simulate scanning at Security Checkpoint"
                className="group relative cursor-pointer block"
              >
                <div className="size-28 bg-white rounded-lg p-2 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <div className="grid grid-cols-5 gap-1 size-full">
                    {[...Array(25)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-[1px] ${
                          i === 0 || i === 4 || i === 20 || i === 24 || i === 12 || (i * 7) % 3 === 0 
                            ? "bg-slate-950" 
                            : "bg-transparent"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-emerald-950/70 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                  Simulate Gate Scan
                </div>
              </a>

              <span className="text-[10px] font-mono text-muted-foreground mt-2 uppercase tracking-widest">
                Scan at Security Checkpoint
              </span>
              <a
                href={`/dashboard/security-gate?pass=${generatedPass?.passNumber || "GP-2026-0812"}`}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-[11px] font-semibold transition-all"
              >
                <span>👮 Open Security Checkpoint</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Gate Pass */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="size-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-foreground">Request Digital Outing Pass</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPassModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Pass Category</label>
                <select
                  value={passType}
                  onChange={(e) => setPassType(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="LIBRARY">Central Library / Academic Study</option>
                  <option value="LOCAL_MARKET">Patia Local Market / Personal Groceries</option>
                  <option value="MEDICAL">Medical Clinic / KIMS Hospital</option>
                  <option value="FEST_EVENT">Campus Fest / Kritansh Event</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. KIIT Central Library Campus 6"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Reason / Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  placeholder="Provide brief reason for leaving hostel campus..."
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Expected Duration</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value={1}>1 Hour (Return before 07:30 PM)</option>
                  <option value={2}>2 Hours (Return before 08:30 PM Curfew)</option>
                  <option value={3}>3 Hours (Extended Library Access)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowPassModal(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-5"
                >
                  {isSubmitting ? "Generating..." : "Generate Pass"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
