"use client";

import { useState, useEffect } from "react";
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
import { requestGatePass, getGatePasses } from "@/app/actions/gate-pass";

function formatPassTime(time: string | Date | undefined, fallback = "08:15 PM") {
  if (!time) return fallback;
  if (typeof time === "string" && (time.includes("AM") || time.includes("PM"))) return time;
  try {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return fallback;
  }
}

export default function TimingsPage() {
  const [showPassModal, setShowPassModal] = useState(false);

  // Form states for gate pass
  const [destination, setDestination] = useState("KIIT Central Library");
  const [purpose, setPurpose] = useState("Project Work");
  const [departureTime, setDepartureTime] = useState("06:15 PM");
  const [expectedReturnTime, setExpectedReturnTime] = useState("08:15 PM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<{
    passNumber: string;
    destination: string;
    purpose: string;
    outTime: string;
    expectedInTime: string;
    status: string;
  } | null>(null);

  // Fetch student's real pass from the database on mount
  useEffect(() => {
    async function loadStudentPass() {
      try {
        const passes = await getGatePasses();
        if (passes && passes.length > 0) {
          const latest = passes[0];
          setGeneratedPass({
            passNumber: latest.passCode || (latest as any).passNumber,
            destination: latest.destination,
            purpose: latest.purpose,
            outTime: formatPassTime(latest.departureTime, "06:15 PM"),
            expectedInTime: formatPassTime(latest.returnTime, "08:15 PM"),
            status: latest.status,
          });
        }
      } catch (err) {
        console.error("Failed to load student gate pass:", err);
      }
    }
    loadStudentPass();
  }, []);

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await requestGatePass({
      destination,
      purpose,
      departureTimeStr: departureTime,
      returnTimeStr: expectedReturnTime,
    });

    if (res.success && res.gatePass) {
      setGeneratedPass({
        passNumber: (res.gatePass as any).passCode || (res.gatePass as any).passNumber,
        destination: res.gatePass.destination,
        purpose: res.gatePass.purpose,
        outTime: departureTime || "06:15 PM",
        expectedInTime: expectedReturnTime || "08:15 PM",
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
              KP-7 Digital Gate Pass
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Digital Gate Pass
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official digital outing pass application and warden authorization status.
          </p>
        </div>

        <Button 
          onClick={() => setShowPassModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/20 text-xs"
        >
          <PlusCircle className="size-4" />
          <span>Apply for Gate Pass</span>
        </Button>
      </div>

      {/* Current Active Gate Pass Card */}
      <Card className="bg-card/70 border-white/10 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Current Pass
            </CardTitle>
            <p className="text-xs text-muted-foreground">Most recent outing request status</p>
          </div>
          <Badge className={`font-bold text-xs ${
            (generatedPass?.status || "PENDING") === "APPROVED" 
              ? "bg-emerald-600 text-white" 
              : (generatedPass?.status || "PENDING") === "REJECTED"
              ? "bg-rose-600 text-white"
              : "bg-amber-500 text-slate-950"
          }`}>
            {generatedPass?.status || "PENDING"}
          </Badge>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xl font-bold text-emerald-400">
              {generatedPass?.passNumber || "GP-2026-0812"}
            </span>
            <span className="text-xs text-muted-foreground">
              Expected Return: <strong className="text-foreground font-mono">{generatedPass?.expectedInTime || "08:15 PM"}</strong>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">Destination</span>
              <p className="text-sm font-semibold text-foreground">
                {generatedPass?.destination || "KIIT Central Library (Campus 6)"}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">Purpose</span>
              <p className="text-xs text-muted-foreground">
                {generatedPass?.purpose || "Project Work"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Curfew Rule: <span className="text-amber-400 font-mono font-semibold">08:30 PM</span>
            </div>
            <Button 
              onClick={() => setShowPassModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 gap-1.5"
            >
              <PlusCircle className="size-3.5" />
              <span>+ Apply for New Gate Pass</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Create Gate Pass */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="size-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-foreground">Apply for Gate Pass</h3>
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
                <label className="text-xs font-semibold text-muted-foreground">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. KIIT Central Library"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  placeholder="e.g. Project Work"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500 resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Departure</label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="06:15 PM"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Expected Return <span className="text-amber-400 text-[10px]">(Curfew: 08:30 PM)</span>
                  </label>
                  <input
                    type="text"
                    value={expectedReturnTime}
                    onChange={(e) => setExpectedReturnTime(e.target.value)}
                    placeholder="08:15 PM"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                Outing passes must adhere to the <strong>08:30 PM</strong> KIIT campus curfew rule.
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-5 font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Submit Pass"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
