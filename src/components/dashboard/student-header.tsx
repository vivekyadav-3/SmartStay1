"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  DoorClosed, 
  Fingerprint, 
  UserCheck, 
  GraduationCap, 
  Copy, 
  Check, 
  SlidersHorizontal,
  ShieldCheck,
  ShieldAlert,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateStudentProfile, toggleBiometricPunch } from "@/app/actions/user";

import { RoleSwitcher } from "@/components/dashboard/role-switcher";

interface StudentHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    biometricStatus: string | null;
    studentProfile?: {
      rollNo?: string | null;
      branch?: string | null;
      semester?: number | null;
      year?: number | null;
      roomNo?: string | null;
      bedNo?: string | null;
      phone?: string | null;
      hostel?: {
        name?: string | null;
        code?: string | null;
      } | null;
    } | null;
    rollNo?: string | null;
    hostelName?: string | null;
    roomNo?: string | null;
    bedNo?: string | null;
    branch?: string | null;
    semester?: string | null;
    phone?: string | null;
  };
}

export default function StudentHeader({ user }: StudentHeaderProps) {
  const profile = user.studentProfile;
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState(user.biometricStatus || "IN_HOSTEL");
  const [isPunching, setIsPunching] = useState(false);

  // Form states initialized directly from database record
  const currentName = user.name || "Student Resident";
  const currentRoll = profile?.rollNo || user.rollNo || "22051000";
  const currentHostel = profile?.hostel?.name || user.hostelName || "King's Palace 7 (KP-7)";
  const currentRoom = profile?.roomNo || user.roomNo || "412";
  const currentBed = profile?.bedNo || user.bedNo || "B";

  const [rollNo, setRollNo] = useState(currentRoll);
  const [hostelName, setHostelName] = useState(currentHostel);
  const [roomNo, setRoomNo] = useState(currentRoom);
  const [bedNo, setBedNo] = useState(currentBed);
  const [name, setName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user.name || "Student Resident");
    setRollNo(profile?.rollNo || user.rollNo || "22051000");
    setHostelName(profile?.hostel?.name || user.hostelName || "King's Palace 7 (KP-7)");
    setRoomNo(profile?.roomNo || user.roomNo || "412");
    setBedNo(profile?.bedNo || user.bedNo || "B");
    setBiometricStatus(user.biometricStatus || "IN_HOSTEL");
  }, [user.id, user.name, profile?.rollNo, profile?.roomNo]);

  const branchDisplay = profile?.branch || user.branch || "B.Tech Computer Science & Engineering";
  const semDisplay = profile?.semester ? `${profile.semester}th Semester (${profile.year || 3}rd Year)` : (user.semester || "5th Semester (3rd Year)");

  const copyRoll = () => {
    navigator.clipboard.writeText(rollNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleBiometric = async () => {
    setIsPunching(true);
    const res = await toggleBiometricPunch(user.id);
    if (res.success && res.status) {
      setBiometricStatus(res.status);
    }
    setIsPunching(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateStudentProfile({
      userId: user.id,
      name,
      rollNo,
      hostelName,
      roomNo,
      bedNo,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const isHostelIn = biometricStatus === "IN_HOSTEL" || biometricStatus === "IN";

  return (
    <div className="space-y-3">
      {/* Top Banner: Central Role Switcher for Presentation Viva */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <RoleSwitcher currentRole={user.role || "STUDENT"} />
        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span>KIIT SmartStay • Academic Capstone 2026</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4 md:p-6 shadow-sm relative overflow-hidden">
        {/* Subtle light blue ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left: KIIT Student Identification */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="size-14 md:size-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-[2px] shadow-md shadow-blue-600/20">
                <div className="size-full bg-blue-900 rounded-2xl flex items-center justify-center font-bold text-xl md:text-2xl text-white">
                  {name?.charAt(0) || "V"}
                </div>
              </div>
              <div 
                className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white flex items-center justify-center ${isHostelIn ? "bg-blue-600" : "bg-amber-500"}`} 
                title={isHostelIn ? "Resident State: Inside Hostel" : "Resident State: Outside Campus"}
              >
                <span className="size-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate text-slate-900">
                  {name}
                </h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
                  KIIT Deemed to be University
                </Badge>
                {user.role === "HEAD_WARDEN" && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                    Dean / Head Warden
                  </Badge>
                )}
                {user.role === "WARDEN" && (
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                    Chief Warden (KP-7)
                  </Badge>
                )}
              </div>

              {/* Subtitle / Department */}
              <p className="text-xs md:text-sm text-slate-600 font-medium flex items-center gap-1.5 flex-wrap">
                <GraduationCap className="size-3.5 text-blue-600" />
                <span>{branchDisplay}</span>
                <span className="opacity-40">•</span>
                <span>{semDisplay}</span>
              </p>

              {/* Crucial Identifiers */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Roll Number */}
                <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-blue-900">
                  <span className="text-slate-500 font-sans font-normal text-[11px]">Roll:</span>
                  <span>{rollNo}</span>
                  <button
                    type="button"
                    onClick={copyRoll}
                    className="hover:text-blue-950 transition-colors ml-1"
                    title="Copy Roll Number"
                  >
                    {copied ? <Check className="size-3 text-blue-600" /> : <Copy className="size-3 opacity-60 hover:opacity-100" />}
                  </button>
                </div>

                {/* Hostel Name */}
                <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800">
                  <Building2 className="size-3.5 text-blue-600" />
                  <span>{hostelName}</span>
                </div>

                {/* Room & Bed */}
                <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800">
                  <DoorClosed className="size-3.5 text-blue-600" />
                  <span>Room {roomNo} (Bed {bedNo})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Presentation Controls & Biometric State */}
          <div className="flex flex-wrap items-center gap-2.5 lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
            {/* Biometric Attendance Punch Toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToggleBiometric}
              disabled={isPunching}
              className={`h-9 px-3 gap-2 border text-xs font-semibold transition-all ${
                isHostelIn
                  ? "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              }`}
            >
              <Fingerprint className="size-3.5" />
              <span>Biometric: <strong>{isHostelIn ? "HOSTEL IN-CAMPUS" : "OUTSIDE CAMPUS"}</strong></span>
            </Button>

            {/* Quick Profile Editor / Switcher for Viva Demo (only for student) */}
            {user.role === "STUDENT" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-9 px-3 gap-1.5 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 text-xs font-medium"
              >
                <SlidersHorizontal className="size-3.5 text-blue-600" />
                <span>{isEditing ? "Close Details" : "Edit Room/Bed"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Profile Switcher Drawer/Drawer Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Roll Number</label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. 22051934"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">KIIT Hostel</label>
            <select
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="King's Palace 7 (KP-7)">King's Palace 7 (KP-7)</option>
              <option value="King's Palace 6 (KP-6)">King's Palace 6 (KP-6)</option>
              <option value="King's Palace 10 (KP-10)">King's Palace 10 (KP-10)</option>
              <option value="Queen's Castle 2 (QC-2)">Queen's Castle 2 (QC-2)</option>
              <option value="Queen's Castle 8 (QC-8)">Queen's Castle 8 (QC-8)</option>
              <option value="King's Palace Intl (KP-Intl)">King's Palace International</option>
            </select>
          </div>

          <div className="space-y-1 flex gap-2">
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Room</label>
              <input
                type="text"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                placeholder="412"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-16">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bed</label>
              <input
                type="text"
                value={bedNo}
                onChange={(e) => setBedNo(e.target.value)}
                placeholder="B"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="text-xs h-8 text-slate-600 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4"
            >
              {isSaving ? "Saving..." : "Apply to Demo Profile"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
