import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Hash, 
  Building2, 
  GraduationCap, 
  Phone, 
  Fingerprint, 
  DoorClosed,
  QrCode,
  Calendar,
  Sparkles,
  ShieldAlert,
  Radio,
  Clock,
  IdCard
} from "lucide-react";
import { redirect } from "next/navigation";
import { syncUser } from "@/app/actions/user";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await syncUser();
  if (!user) redirect("/login");

  // 1. SECURITY OFFICER PROFILE VIEW
  if (user.role === "SECURITY") {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
              KIIT Security & Vigilance Directorate
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              Employee ID: SEC-KP7-01
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Security Officer Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official KIIT Campus Security & KP-7 Checkpoint Officer credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Detailed Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-card/80 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-bold text-foreground">
                  Security Checkpoint Officer Record
                </CardTitle>
                <CardDescription>
                  Active gate post and enforcement credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-6">
                {/* Officer Avatar + Name */}
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 p-[2px] shadow-lg shadow-blue-500/25">
                    <div className="size-full bg-slate-950 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-400 font-mono">
                      {user.name?.charAt(0) || "H"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">{user.name || "Havildar R. K. Swain"}</h3>
                    <p className="text-xs text-blue-400 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-blue-400" />
                      <span>Security Checkpoint Officer</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      KIIT Campus Security & Vigilance Directorate • Campus 12
                    </p>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Hash className="size-3 text-blue-400" /> Employee ID
                    </p>
                    <p className="text-sm font-mono font-bold text-blue-300">SEC-KP7-01</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-blue-400" /> Assigned Location
                    </p>
                    <p className="text-sm font-medium text-foreground">KP-7 Main Gate</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3 text-amber-400" /> Shift & Duty Post
                    </p>
                    <p className="text-sm font-medium text-foreground">Night Watch (06:00 PM – 06:00 AM)</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Radio className="size-3 text-emerald-400" /> Security Net Intercom
                    </p>
                    <p className="text-sm font-medium text-emerald-300 font-mono">Channel 4 (Campus 12)</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Mail className="size-3 text-muted-foreground" /> Official Email
                    </p>
                    <p className="text-xs font-mono text-muted-foreground truncate">{user.email || "security.kp7@kiit.ac.in"}</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Phone className="size-3 text-muted-foreground" /> Emergency Dispatch
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">+91 674 272 5113</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkpoint Details */}
            <Card className="bg-black/30 border-white/10">
              <CardContent className="py-5 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <MapPin className="size-4 text-blue-400" />
                  <span>Checkpoint Station Jurisdiction</span>
                </div>
                <p>
                  King's Palace 7 Main Gate Barrier, Campus 12, KIIT Deemed to be University, Bhubaneswar.
                </p>
                <p className="text-[11px] text-blue-400/80">
                  Curfew Enforcement Protocol: <strong>08:30 PM Nightly</strong> • Central Security Control: <strong>Campus 1 Main Tower</strong>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Security Officer Official ID Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Security Officer Credentials
              </span>
              <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                Active Staff
              </Badge>
            </div>

            {/* Official Officer Badge Mockup */}
            <div className="w-full rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-800 to-slate-900 p-[2px] shadow-2xl shadow-blue-500/20">
              <div className="w-full rounded-3xl bg-slate-950/95 backdrop-blur-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute -top-16 -right-16 size-40 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="size-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <ShieldCheck className="size-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black tracking-tight uppercase text-white leading-none">
                      KIIT Security
                    </h4>
                    <span className="text-[9px] text-blue-400 font-medium">Vigilance & Gate Control</span>
                  </div>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/10 px-3 py-0.5 rounded-full border border-blue-500/30 mb-4">
                  Security Checkpoint Officer
                </span>

                <div className="size-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-800 p-[2px] mb-3 shadow-lg">
                  <div className="size-full rounded-2xl bg-slate-900 flex items-center justify-center text-3xl font-bold font-mono text-blue-400">
                    {user.name?.charAt(0) || "H"}
                  </div>
                </div>

                <div className="space-y-0.5 mb-4">
                  <h3 className="text-lg font-bold text-white">{user.name || "Havildar R. K. Swain"}</h3>
                  <p className="text-xs font-mono font-bold text-blue-400">EMP ID: SEC-KP7-01</p>
                  <p className="text-[11px] text-muted-foreground">Location: KP-7 Main Gate</p>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 text-left bg-black/50 p-3 rounded-xl border border-white/5 mb-2">
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Role</span>
                    <span className="text-xs font-bold text-white block">Checkpoint Officer</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Gate Post</span>
                    <span className="text-xs font-bold text-white block">KP-7 Main Gate</span>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-blue-400/80 uppercase tracking-wider pt-2">
                  Authorized Outing Pass Verifier
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. WARDEN PROFILE VIEW
  if (user.role === "WARDEN") {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
              KIIT Hostel Administration
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              Staff ID: WRD-KP7-01
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Chief Warden Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hostel Superintendent & Gate Pass Authorization Authority.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-card/80 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-bold text-foreground">
                  Hostel Superintendent Credentials
                </CardTitle>
                <CardDescription>
                  KP-7 Resident Administration & Outing Approval Authority
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-[2px] shadow-lg shadow-amber-500/25">
                    <div className="size-full bg-slate-950 rounded-2xl flex items-center justify-center text-2xl font-bold text-amber-400 font-mono">
                      {user.name?.charAt(0) || "P"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">{user.name || "Prof. S. K. Mohapatra"}</h3>
                    <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="size-3.5 text-amber-400" />
                      <span>Chief Warden (King's Palace 7)</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      KIIT Hostel Administration & Student Affairs
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Hash className="size-3 text-amber-400" /> Employee ID
                    </p>
                    <p className="text-sm font-mono font-bold text-amber-300">WRD-KP7-01</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Building2 className="size-3 text-amber-400" /> Office Location
                    </p>
                    <p className="text-sm font-medium text-foreground">KP-7 Warden Office (Campus 12)</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Phone className="size-3 text-amber-400" /> Intercom Extension
                    </p>
                    <p className="text-sm font-medium text-foreground font-mono">Ext #402</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Mail className="size-3 text-muted-foreground" /> Official Email
                    </p>
                    <p className="text-xs font-mono text-muted-foreground truncate">{user.email || "warden.kp7@kiit.ac.in"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="w-full rounded-3xl bg-gradient-to-br from-amber-600 via-amber-800 to-slate-900 p-[2px] shadow-2xl shadow-amber-500/20">
              <div className="w-full rounded-3xl bg-slate-950/95 backdrop-blur-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <ShieldAlert className="size-6 text-amber-400" />
                  <div className="text-left">
                    <h4 className="text-xs font-black uppercase text-white leading-none">KIIT Administration</h4>
                    <span className="text-[9px] text-amber-400">Hostel Superintendent</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{user.name || "Prof. S. K. Mohapatra"}</h3>
                <p className="text-xs font-mono font-bold text-amber-400">STAFF: WRD-KP7-01</p>
                <p className="text-[11px] text-muted-foreground mt-1">Chief Warden • King's Palace 7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. STUDENT PROFILE VIEW (Read directly from database!)
  const profile = (user as any).studentProfile;
  const rollNo = profile?.rollNo || "22051934";
  const hostelName = profile?.hostel?.name || "King's Palace 7 (KP-7)";
  const roomNo = profile?.roomNo || "412";
  const bedNo = profile?.bedNo || "B";
  const branch = profile?.branch || "Computer Science & Engineering";
  const semester = profile?.semester ? `${profile.semester}th Semester (${profile.year || 3}rd Year)` : "6th Semester (3rd Year)";
  const phone = profile?.phone || "+91 98765 43210";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
            KIIT Student Directorate
          </Badge>
          <Badge variant="outline" className="text-xs">
            Identity Card #KIIT-{rollNo}
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
          Student Profile & Digital ID
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Official KIIT Bhubaneswar Hostel Resident credentials, RFID ID and room allotment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Detailed Information (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-card/80 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-base font-bold text-foreground">
                Student Academic & Hostel Record
              </CardTitle>
              <CardDescription>
                Hostel allotment and resident credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              {/* User Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-[2px] shadow-lg shadow-emerald-500/25">
                  <div className="size-full bg-slate-950 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-400 font-mono">
                    {user.name?.charAt(0) || "V"}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-emerald-400" />
                    <span>{branch}</span>
                  </p>
                  <p className="text-[11px] text-emerald-400/90 font-medium">
                    {semester} • School of Computer Engineering
                  </p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Hash className="size-3 text-emerald-400" /> Roll Number
                  </p>
                  <p className="text-sm font-mono font-bold text-emerald-300">{rollNo}</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Building2 className="size-3 text-emerald-400" /> Allotted Hostel
                  </p>
                  <p className="text-sm font-medium text-foreground">{hostelName}</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <DoorClosed className="size-3 text-blue-400" /> Room & Bed Number
                  </p>
                  <p className="text-sm font-medium text-foreground">Room {roomNo} (Bed {bedNo})</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Fingerprint className="size-3 text-emerald-400" /> Biometric Status
                  </p>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                    {user.biometricStatus === "IN" || user.biometricStatus === "IN_HOSTEL" ? "Hostel Resident (Punched IN)" : "Punched OUT on Pass"}
                  </Badge>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3 text-muted-foreground" /> Email Address
                  </p>
                  <p className="text-xs font-mono text-muted-foreground truncate">{user.email}</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Phone className="size-3 text-muted-foreground" /> Emergency Contact
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">{phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KIIT Campus Details */}
          <Card className="bg-black/30 border-white/10">
            <CardContent className="py-5 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <MapPin className="size-4 text-emerald-400" />
                <span>Hostel Campus Location</span>
              </div>
              <p>
                King's Palace 7 (Senior Men's Residence), Campus 12, KIIT Deemed to be University, Patia, Bhubaneswar, Odisha - 751024.
              </p>
              <p className="text-[11px] text-emerald-400/80">
                Warden Control Room Intercom: <strong>Ext #402</strong> • Campus Security Dispatch: <strong>+91 674 272 5113</strong>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: KIIT Digital RFID Student ID Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              SmartStay Resident ID
            </span>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
              Valid 2023 - 2027
            </Badge>
          </div>

          {/* Physical ID Card Mockup */}
          <div className="w-full rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-700 to-teal-900 p-[2px] shadow-2xl shadow-emerald-500/20">
            <div className="w-full rounded-3xl bg-slate-950/95 backdrop-blur-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute -top-16 -right-16 size-40 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="size-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Building2 className="size-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black tracking-tight uppercase text-white leading-none">
                    KIIT University
                  </h4>
                  <span className="text-[9px] text-emerald-400 font-medium">Bhubaneswar, Odisha</span>
                </div>
              </div>

              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/30 mb-4">
                Hostel Resident Smart ID
              </span>

              <div className="size-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 p-[2px] mb-3 shadow-lg">
                <div className="size-full rounded-2xl bg-slate-900 flex items-center justify-center text-3xl font-bold font-mono text-emerald-400">
                  {user.name?.charAt(0) || "V"}
                </div>
              </div>

              <div className="space-y-0.5 mb-4">
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-xs font-mono font-bold text-emerald-400">ROLL: {rollNo}</p>
                <p className="text-[11px] text-muted-foreground">{branch}</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 text-left bg-black/50 p-3 rounded-xl border border-white/5 mb-4">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Hostel</span>
                  <span className="text-xs font-bold text-white truncate block">{hostelName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Room Allotment</span>
                  <span className="text-xs font-bold text-white block">Room {roomNo} ({bedNo})</span>
                </div>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-md mb-2">
                <div className="grid grid-cols-5 gap-1 size-16">
                  {[...Array(25)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-[1px] ${
                        i === 0 || i === 4 || i === 20 || i === 24 || (i * 13) % 2 === 0 
                          ? "bg-slate-950" 
                          : "bg-transparent"
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                Scan for Mess & Gate Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
