"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  MapPin, 
  PlusCircle, 
  Building2,
  FileCheck2,
  Calendar
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

export default function LibraryPassPage() {
  const [showPassModal, setShowPassModal] = useState(false);
  const [destination, setDestination] = useState("KIIT Central Library (Campus 6)");
  const [purpose, setPurpose] = useState("Academic Study & Research");
  const [departureTime, setDepartureTime] = useState("06:00 PM");
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
            outTime: formatPassTime(latest.departureTime, "06:00 PM"),
            expectedInTime: formatPassTime(latest.returnTime, "08:15 PM"),
            status: latest.status,
          });
        }
      } catch (err) {
        console.error("Failed to load library pass:", err);
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
        outTime: departureTime || "06:00 PM",
        expectedInTime: expectedReturnTime || "08:15 PM",
        status: res.gatePass.status,
      });
      setShowPassModal(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Page Title & Institutional Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="size-5" />
            </div>
            <h2 className="text-xl font-extrabold text-blue-950">KIIT Central Library Pass</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exclusive digital pass for hostel residents visiting the Central Library & Reading Rooms. Curfew is strictly <strong>08:30 PM</strong>.
          </p>
        </div>

        <Button
          onClick={() => setShowPassModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md shadow-blue-600/20 shrink-0"
        >
          <PlusCircle className="size-4 mr-2" />
          Apply for Library Pass
        </Button>
      </div>

      {/* Main Grid: Active Pass on Left, Regulations & Schedule on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Active Library Pass */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  Digital Library Pass
                </span>
                <CardTitle className="text-lg font-black text-white mt-0.5 font-mono">
                  {generatedPass?.passNumber || "LIB-2026-4821"}
                </CardTitle>
              </div>
              <Badge
                className={`text-xs font-bold uppercase px-2.5 py-1 ${
                  generatedPass?.status === "APPROVED"
                    ? "bg-blue-500 text-white"
                    : generatedPass?.status === "ACTIVE"
                    ? "bg-indigo-500 text-white"
                    : "bg-amber-400 text-slate-950"
                }`}
              >
                {generatedPass?.status || "PENDING WARDEN APPROVAL"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Pass details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">Vivek Yadav</span>
                  <span className="text-[11px] text-slate-500 block font-mono">Roll: 22051934</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Hostel Room</span>
                  <span className="font-bold text-slate-900 text-sm">KP-7, Room 412</span>
                  <span className="text-[11px] text-slate-500 block">Bed B</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Destination:</span>
                  <span className="font-bold text-blue-950">{generatedPass?.destination || "KIIT Central Library (Campus 6)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Purpose:</span>
                  <span className="font-medium text-slate-800">{generatedPass?.purpose || "Academic Study & Research"}</span>
                </div>
                <div className="flex items-center justify-between border-t border-blue-200/60 pt-2">
                  <span className="text-slate-500 font-semibold">Out / Expected Return:</span>
                  <span className="font-mono font-bold text-blue-900">
                    {generatedPass?.outTime || "06:00 PM"} → {generatedPass?.expectedInTime || "08:15 PM"}
                  </span>
                </div>
              </div>

              {/* QR Verification Visual */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center gap-4">
                <div className="size-16 rounded-lg bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0 shadow-xs">
                  <QrCode className="size-12 text-slate-800" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Gate Verification QR</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Present this to KP-7 gate security checkpoint during biometric punching.
                  </p>
                  {generatedPass?.status === "APPROVED" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 mt-1">
                      <CheckCircle2 className="size-3.5" /> Approved by Warden
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowPassModal(true)}
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold"
            >
              Modify / Request New Library Pass
            </Button>
          </CardContent>
        </Card>

        {/* Right: Library Timings & Curfew Guidelines */}
        <div className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="size-4 text-blue-600" />
                Central Library Hours & Curfew Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Strict Curfew: 08:30 PM</strong>
                  <span>
                    All students visiting the Central Library must be inside KP-7 by 08:30 PM. Failure to return triggers an automatic SMS notification to parents.
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-800">Campus 6 Central Library (General)</span>
                  <span className="font-mono text-slate-600">08:00 AM – 09:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-800">Reading Room (Campus 12 ICT Wing)</span>
                  <span className="font-mono text-slate-600">06:00 PM – 08:15 PM</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-800">Book Lending & Journal Return</span>
                  <span className="font-mono text-slate-600">Until 08:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick FAQ for Non-Tech Savvy Users */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                How It Works (3 Steps)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="size-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <span>Click <strong>Apply for Library Pass</strong> and submit your departure & return time.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <span>The Chief Warden receives it on the Warden Portal and clicks <strong>Approve</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                <span>Show this approved screen at KP-7 gate to punch out seamlessly!</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Request Central Library Pass</h3>
                <p className="text-xs text-slate-500">Fast application for evening reading session</p>
              </div>
              <button
                onClick={() => setShowPassModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Library Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="KIIT Central Library (Campus 6)">KIIT Central Library (Campus 6)</option>
                  <option value="ICT Reading Room (Campus 12)">ICT Reading Room (Campus 12)</option>
                  <option value="KMC Health Sciences Library (Campus 5)">KMC Health Sciences Library (Campus 5)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Study Purpose</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="e.g. End-sem exam revision, reference books"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Out Time</label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Return By (Curfew 08:30)</label>
                  <input
                    type="text"
                    value={expectedReturnTime}
                    onChange={(e) => setExpectedReturnTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5"
                >
                  {isSubmitting ? "Submitting..." : "Submit Pass to Warden"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
