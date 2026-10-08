"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { Siren, PhoneCall, CheckCircle2, AlertTriangle, X, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dispatchEmergencyAlert } from "@/app/actions/medical";

interface EmergencyModalProps {
  initialStudent?: {
    name?: string | null;
    rollNo?: string | null;
    hostelName?: string | null;
    roomNo?: string | null;
    phone?: string | null;
  };
}

export function EmergencyModal({ initialStudent }: EmergencyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("High Fever / Severe Weakness");
  const [studentName, setStudentName] = useState(initialStudent?.name || "Vivek Yadav");
  const [rollNo, setRollNo] = useState(initialStudent?.rollNo || "22051934");
  const [hostelName, setHostelName] = useState(initialStudent?.hostelName || "King's Palace 7 (KP-7)");
  const [roomNo, setRoomNo] = useState(initialStudent?.roomNo || "412");
  const [phone, setPhone] = useState(initialStudent?.phone || "+91 98765 43210");

  const commonIssues = [
    "High Fever / Severe Weakness",
    "Breathing Trouble / Asthma",
    "Acute Stomach Infection",
    "Physical Injury / Fall",
    "Chest Discomfort / Fainting",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDispatch = () => {
    startTransition(async () => {
      const finalSymptoms = symptoms.trim() ? `${selectedIssue} - ${symptoms.trim()}` : selectedIssue;
      const res = await dispatchEmergencyAlert({
        studentName,
        rollNo,
        hostelName,
        roomNo,
        phone,
        symptoms: finalSymptoms,
      });

      if (res?.success) {
        setSubmitted(true);
      }
    });
  };

  const modalContent = isOpen && mounted ? (
    <div
      onClick={(e) => {
        // Dismiss when clicking outer darkened backdrop
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-red-200 relative max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* 1. Header with Close Button */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <HeartPulse className="size-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 leading-none">
                Hostel Medical Emergency
                <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                  Live SOS
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Campus Ambulance & Warden Priority Dispatch
              </p>
            </div>
          </div>

          {/* Prominent Cancel/Close button in header */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs transition-colors border border-slate-200"
            title="Cancel and close dialog"
          >
            <X className="size-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        {submitted ? (
          <div className="py-6 space-y-4 text-center overflow-y-auto flex-1">
            <div className="size-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">Emergency Alert Transmitted!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Alert received at <span className="font-semibold text-blue-900">Warden Portal</span> for{" "}
                <span className="font-semibold">{hostelName}, Room {roomNo}</span>.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-left space-y-2 text-xs">
              <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wide">
                Direct Hotlines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="tel:06742725113"
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-blue-200 text-blue-950 font-medium hover:bg-blue-100 transition text-[11px]"
                >
                  <PhoneCall className="size-3 text-red-600" />
                  <span>KIMS: 0674-2725113</span>
                </a>
                <a
                  href="tel:9861299999"
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-blue-200 text-blue-950 font-medium hover:bg-blue-100 transition text-[11px]"
                >
                  <PhoneCall className="size-3 text-blue-600" />
                  <span>Dispensary: 9861299999</span>
                </a>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold h-10 rounded-xl"
            >
              Close & Await Medical Team
            </Button>
          </div>
        ) : (
          <div className="py-3.5 space-y-3.5 overflow-y-auto flex-1 pr-1">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2 text-amber-900 text-xs">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-tight">
                Dispatches an immediate alert to KP-7 Warden desk and logs your exact room coordinates for emergency response.
              </span>
            </div>

            {/* Patient Room Details */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Roll Number</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Hostel</label>
                <input
                  type="text"
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Room No</label>
                <input
                  type="text"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Common Emergency Types */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Select Medical Situation:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {commonIssues.map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => setSelectedIssue(issue)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      selectedIssue === issue
                        ? "bg-blue-900 text-white shadow-xs font-semibold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Note */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                Specific Condition (Optional):
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Student is vomiting, high fever 103F, unable to walk..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>
        )}

        {/* 3. Footer (Sticky at Bottom with Explicit Cancel & Dispatch) */}
        {!submitted && (
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-1/3 border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs h-10 rounded-xl"
            >
              Cancel / Close
            </Button>
            <Button
              type="button"
              onClick={handleDispatch}
              disabled={isPending}
              className="w-full sm:w-2/3 bg-red-600 hover:bg-red-700 text-white font-bold h-10 rounded-xl shadow-md shadow-red-600/30 flex items-center justify-center gap-2 text-xs"
            >
              <Siren className="size-4 animate-bounce shrink-0" />
              <span>{isPending ? "Transmitting SOS..." : "🚨 Dispatch Ambulance"}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Header Medical SOS Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setSubmitted(false);
          setIsOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        title="Immediate Medical SOS / Ambulance Alert"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <Siren className="size-4 shrink-0" />
        <span>Medical SOS / Ambulance</span>
      </button>

      {/* Render via React Portal directly into body */}
      {mounted && typeof document !== "undefined" && modalContent
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
