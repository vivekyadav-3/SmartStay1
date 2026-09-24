"use client";

import { useState } from "react";
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
  const [rollNo, setRollNo] = useState(profile?.rollNo || user.rollNo || "22051934");
  const [hostelName, setHostelName] = useState(profile?.hostel?.name || user.hostelName || "King's Palace 7 (KP-7)");
  const [roomNo, setRoomNo] = useState(profile?.roomNo || user.roomNo || "412");
  const [bedNo, setBedNo] = useState(profile?.bedNo || user.bedNo || "B");
  const [name, setName] = useState(user.name || "Vivek Yadav");
  const [isSaving, setIsSaving] = useState(false);

  const branchDisplay = profile?.branch || user.branch || "B.Tech Computer Science & Engineering";
  const semDisplay = profile?.semester ? `${profile.semester}th Semester (${profile.year || 3}rd Year)` : (user.semester || "6th Semester (3rd Year)");

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

      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-card/80 to-card/90 border border-emerald-500/20 backdrop-blur-xl p-4 md:p-6 shadow-xl relative overflow-hidden">
        {/* Decorative emerald ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left: KIIT Student Identification */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="size-14 md:size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-[2px] shadow-lg shadow-emerald-500/20">
                <div className="size-full bg-slate-950 rounded-2xl flex items-center justify-center font-bold text-xl md:text-2xl text-emerald-400">
                  {name?.charAt(0) || "V"}
                </div>
              </div>
              <div 
                className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-background flex items-center justify-center ${isHostelIn ? "bg-emerald-500" : "bg-amber-500"}`} 
                title={isHostelIn ? "Resident State: Inside Hostel" : "Resident State: Outside Campus"}
              >
                <span className="size-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate text-foreground">
                  {name}
                </h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                  KIIT Deemed to be University
                </Badge>
                {user.role === "WARDEN" && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                    Chief Warden (KP-7)
                  </Badge>
                )}
                {user.role === "SECURITY" && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                    Security Checkpoint Officer
                  </Badge>
                )}
              </div>

              <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <GraduationCap className="size-3.5 text-emerald-400" />
                <span>{branchDisplay}</span>
                <span className="opacity-40">•</span>
                <span>{semDisplay}</span>
              </p>

              {/* Crucial Student Identifiers: Roll No, Hostel, Room */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Roll Number */}
                <div className="inline-flex items-center gap-1.5 bg-black/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-emerald-300">
                  <span className="text-muted-foreground font-sans font-normal text-[11px]">Roll:</span>
                  <span>{rollNo}</span>
                  <button
                    type="button"
                    onClick={copyRoll}
                    className="hover:text-white transition-colors ml-1"
                    title="Copy Roll Number"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3 opacity-60 hover:opacity-100" />}
                  </button>
                </div>

                {/* Hostel Name */}
                <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-foreground">
                  <Building2 className="size-3.5 text-emerald-400" />
                  <span>{hostelName}</span>
                </div>

                {/* Room & Bed */}
                <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-foreground">
                  <DoorClosed className="size-3.5 text-blue-400" />
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
              className={`h-9 px-3 gap-2 border text-xs font-medium transition-all ${
                isHostelIn
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <Fingerprint className="size-3.5" />
              <span>Biometric: <strong>{isHostelIn ? "HOSTEL IN-CAMPUS" : "OUTSIDE CAMPUS"}</strong></span>
            </Button>

            {/* Quick Profile Editor / Switcher for Viva Demo */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-9 px-3 gap-1.5 border-white/10 hover:border-emerald-500/40 text-xs"
            >
              <SlidersHorizontal className="size-3.5 text-emerald-400" />
              <span>{isEditing ? "Close Details" : "Edit Room/Bed"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Profile Switcher Drawer/Drawer Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-black/30 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Roll Number</label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. 22051934"
              className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">KIIT Hostel</label>
            <select
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-emerald-500"
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
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Room</label>
              <input
                type="text"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                placeholder="412"
                className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="w-16">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Bed</label>
              <input
                type="text"
                value={bedNo}
                onChange={(e) => setBedNo(e.target.value)}
                placeholder="B"
                className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-4"
            >
              {isSaving ? "Saving..." : "Apply to Demo Profile"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
