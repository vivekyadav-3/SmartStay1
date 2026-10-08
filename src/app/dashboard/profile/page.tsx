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
  Clock,
  IdCard,
  ShieldAlert,
  Radio,
  Sparkles,
  KeyRound
} from "lucide-react";
import { redirect } from "next/navigation";
import { syncUser } from "@/app/actions/user";
import { ChangePasswordCard } from "@/components/dashboard/change-password-card";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await syncUser();
  if (!user) redirect("/login");

  // 1. SECURITY OFFICER PROFILE VIEW
  if (user.role === "SECURITY") {
    return (
      <div className="max-w-5xl mx-auto space-y-8 text-slate-900 pb-16">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
              KIIT Security & Vigilance Directorate
            </Badge>
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-mono">
              Employee ID: SEC-KP7-01
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-slate-900">
            Security Checkpoint Officer Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official KIIT Campus Security & KP-7 Checkpoint Officer credentials and gate post authorization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Detailed Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">
                  Security Checkpoint Officer Record
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Active gate post and enforcement credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-6">
                {/* Officer Avatar + Name */}
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 p-[2px] shadow-md shadow-blue-700/20">
                    <div className="size-full bg-blue-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white font-mono">
                      {user.name?.charAt(0) || "H"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{user.name || "Havildar R. K. Swain"}</h3>
                    <p className="text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-blue-700" />
                      <span>Security Checkpoint Officer</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      KIIT Campus Security & Vigilance Directorate • Campus 12
                    </p>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Hash className="size-3 text-blue-600" /> Employee ID
                    </p>
                    <p className="text-sm font-mono font-bold text-blue-950">SEC-KP7-01</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <MapPin className="size-3 text-blue-600" /> Assigned Location
                    </p>
                    <p className="text-sm font-bold text-slate-800">KP-7 Main Gate</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="size-3 text-blue-600" /> Shift & Duty Post
                    </p>
                    <p className="text-sm font-medium text-slate-800">Night Watch (06:00 PM – 06:00 AM)</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Radio className="size-3 text-blue-600" /> Security Net Intercom
                    </p>
                    <p className="text-sm font-medium text-blue-900 font-mono">Channel 4 (Campus 12)</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Mail className="size-3 text-slate-400" /> Official Email
                    </p>
                    <p className="text-xs font-mono text-slate-700 truncate">{user.email || "security.kp7@kiit.ac.in"}</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Phone className="size-3 text-slate-400" /> Emergency Dispatch
                    </p>
                    <p className="text-xs font-mono text-slate-700">+91 674 272 5113</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkpoint Details */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="py-5 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <MapPin className="size-4 text-blue-600" />
                  <span>Checkpoint Station Jurisdiction</span>
                </div>
                <p>
                  King's Palace 7 Main Gate Barrier, Campus 12, KIIT Deemed to be University, Bhubaneswar.
                </p>
                <p className="text-[11px] text-blue-800 font-medium">
                  Curfew Enforcement Protocol: <strong>08:30 PM Nightly</strong> • Central Security Control: <strong>Campus 1 Main Tower</strong>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Security Officer Official ID Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security Officer Credentials
              </span>
              <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 font-bold">
                Active Staff
              </Badge>
            </div>

            {/* Officer ID Mockup in Blue & White */}
            <div className="w-full rounded-3xl bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 p-[2px] shadow-xl shadow-blue-900/20">
              <div className="w-full rounded-3xl bg-white p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ShieldCheck className="size-5 text-blue-700" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black tracking-tight uppercase text-blue-950 leading-none">
                      KIIT Security
                    </h4>
                    <span className="text-[9px] text-blue-600 font-medium">Vigilance & Gate Control</span>
                  </div>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-800 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200 mb-4">
                  Security Checkpoint Officer
                </span>

                <div className="size-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-[2px] mb-3 shadow-md">
                  <div className="size-full rounded-2xl bg-blue-950 flex items-center justify-center text-3xl font-bold font-mono text-white">
                    {user.name?.charAt(0) || "H"}
                  </div>
                </div>

                <div className="space-y-0.5 mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{user.name || "Havildar R. K. Swain"}</h3>
                  <p className="text-xs font-mono font-bold text-blue-700">EMP ID: SEC-KP7-01</p>
                  <p className="text-[11px] text-slate-500">Location: KP-7 Main Gate</p>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 mb-2">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Role</span>
                    <span className="text-xs font-bold text-slate-800 block">Checkpoint Officer</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Gate Post</span>
                    <span className="text-xs font-bold text-slate-800 block">KP-7 Main Gate</span>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-blue-800 uppercase tracking-wider pt-2 font-semibold">
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
  if (user.role === "WARDEN" || user.role === "HEAD_WARDEN") {
    return (
      <div className="max-w-5xl mx-auto space-y-8 text-slate-900 pb-16">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
              KIIT Hostel Administration
            </Badge>
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-mono">
              Staff ID: WRD-KP7-01
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-slate-900">
            Chief Warden Official Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Hostel Superintendent, Resident Welfare & Gate Pass Authorization Authority.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">
                  Hostel Superintendent Credentials
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  KP-7 Resident Administration & Outing Approval Authority
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-950 p-[2px] shadow-md shadow-blue-700/20">
                    <div className="size-full bg-blue-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white font-mono">
                      {user.name?.charAt(0) || "P"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{user.name || "Prof. S. K. Mohapatra"}</h3>
                    <p className="text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="size-3.5 text-blue-700" />
                      <span>Chief Warden (King's Palace 7)</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      KIIT Hostel Administration & Student Affairs • Campus 12
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Hash className="size-3 text-blue-600" /> Employee ID
                    </p>
                    <p className="text-sm font-mono font-bold text-blue-950">WRD-KP7-01</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Building2 className="size-3 text-blue-600" /> Office Location
                    </p>
                    <p className="text-sm font-bold text-slate-800">KP-7 Warden Office (Campus 12)</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Phone className="size-3 text-blue-600" /> Intercom Extension
                    </p>
                    <p className="text-sm font-bold text-slate-800 font-mono">Ext #402</p>
                  </div>

                  <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Mail className="size-3 text-slate-400" /> Official Email
                    </p>
                    <p className="text-xs font-mono text-slate-700 truncate">{user.email || "warden.kp7@kiit.ac.in"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card for Warden */}
            <ChangePasswordCard isDefault={false} />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Staff Identity Card
              </span>
              <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 font-bold">
                Authorized Authority
              </Badge>
            </div>

            <div className="w-full rounded-3xl bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 p-[2px] shadow-xl shadow-blue-900/20">
              <div className="w-full rounded-3xl bg-white p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="size-5 text-blue-700" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black uppercase text-blue-950 leading-none">KIIT Administration</h4>
                    <span className="text-[9px] text-blue-600 font-medium">Hostel Superintendent</span>
                  </div>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-800 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200 mb-4">
                  Chief Warden
                </span>

                <div className="size-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-[2px] mb-3 shadow-md">
                  <div className="size-full rounded-2xl bg-blue-950 flex items-center justify-center text-3xl font-bold font-mono text-white">
                    {user.name?.charAt(0) || "P"}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2">{user.name || "Prof. S. K. Mohapatra"}</h3>
                <p className="text-xs font-mono font-bold text-blue-700">STAFF: WRD-KP7-01</p>
                <p className="text-[11px] text-slate-500 mt-1">Chief Warden • King's Palace 7</p>

                <div className="w-full grid grid-cols-2 gap-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 mt-4 mb-2">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Jurisdiction</span>
                    <span className="text-xs font-bold text-slate-800 block">Hostel KP-7</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Campus</span>
                    <span className="text-xs font-bold text-slate-800 block">Campus 12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. STUDENT PROFILE VIEW (Read directly from database!)
  const profile = (user as any).studentProfile;
  const rollNo = profile?.rollNo || user.email?.split("@")[0] || "2428001";
  const hostelName = profile?.hostel?.name || "King's Palace 7 (KP-7)";
  const roomNo = profile?.roomNo || "412";
  const bedNo = profile?.bedNo || "B";
  const branch = profile?.branch || "Computer Science & Engineering";
  const semester = profile?.semester ? `${profile.semester}th Semester (${profile.year || 3}rd Year)` : "5th Semester (3rd Year)";
  const phone = profile?.phone || "+91 98765 43210";

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-900 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
            KIIT Student Directorate
          </Badge>
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-mono">
            Identity Card #{rollNo}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-slate-900">
          Student Profile & Digital ID
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Official KIIT Bhubaneswar Hostel Resident credentials, RFID ID and room allotment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Detailed Information (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Student Academic & Hostel Record
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Hostel allotment and resident credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              {/* User Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-[2px] shadow-md shadow-blue-600/20">
                  <div className="size-full bg-blue-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white font-mono">
                    {user.name?.charAt(0) || "S"}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-blue-600" />
                    <span>{branch}</span>
                  </p>
                  <p className="text-[11px] text-blue-700 font-semibold">
                    {semester} • School of Computer Engineering
                  </p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Hash className="size-3 text-blue-600" /> Roll Number
                  </p>
                  <p className="text-sm font-mono font-bold text-blue-950">{rollNo}</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Building2 className="size-3 text-blue-600" /> Allotted Hostel
                  </p>
                  <p className="text-sm font-bold text-slate-800">{hostelName}</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <DoorClosed className="size-3 text-blue-600" /> Room & Bed Number
                  </p>
                  <p className="text-sm font-bold text-slate-800">Room {roomNo} (Bed {bedNo})</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Fingerprint className="size-3 text-blue-600" /> Biometric Status
                  </p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs font-semibold">
                    {user.biometricStatus === "IN" || user.biometricStatus === "IN_HOSTEL" ? "Hostel Resident (Punched IN)" : "Punched OUT on Pass"}
                  </Badge>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Mail className="size-3 text-slate-400" /> Email Address
                  </p>
                  <p className="text-xs font-mono text-slate-700 truncate">{user.email}</p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Phone className="size-3 text-slate-400" /> Emergency Contact
                  </p>
                  <p className="text-xs font-mono text-slate-700">{phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Component for KIIT Students */}
          <ChangePasswordCard isDefault={user.passwordHash === "$2a$10$demoHashedPasswordSmartStay2026" || user.passwordHash === "Kiit@123"} />

          {/* KIIT Campus Details */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="py-5 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <MapPin className="size-4 text-blue-600" />
                <span>Hostel Campus Location</span>
              </div>
              <p>
                King's Palace 7 (Senior Men's Residence), Campus 12, KIIT Deemed to be University, Patia, Bhubaneswar, Odisha - 751024.
              </p>
              <p className="text-[11px] text-blue-800">
                Warden Control Room Intercom: <strong>Ext #402</strong> • Campus Security Dispatch: <strong>+91 674 272 5113</strong>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: KIIT Digital RFID Student ID Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SmartStay Resident ID
            </span>
            <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 font-bold">
              Valid 2024 - 2028
            </Badge>
          </div>

          {/* Physical ID Card Mockup in Blue & White */}
          <div className="w-full rounded-3xl bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 p-[2px] shadow-xl shadow-blue-900/20">
            <div className="w-full rounded-3xl bg-white p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="size-5 text-blue-700" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black tracking-tight uppercase text-blue-950 leading-none">
                    KIIT University
                  </h4>
                  <span className="text-[9px] text-blue-600 font-medium">Bhubaneswar, Odisha</span>
                </div>
              </div>

              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-800 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200 mb-4">
                Hostel Resident Smart ID
              </span>

              <div className="size-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-[2px] mb-3 shadow-md">
                <div className="size-full rounded-2xl bg-blue-950 flex items-center justify-center text-3xl font-bold font-mono text-white">
                  {user.name?.charAt(0) || "S"}
                </div>
              </div>

              <div className="space-y-0.5 mb-4">
                <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                <p className="text-xs font-mono font-bold text-blue-700">ROLL: {rollNo}</p>
                <p className="text-[11px] text-slate-500">{branch}</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Hostel</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">{hostelName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Room Allotment</span>
                  <span className="text-xs font-bold text-slate-800 block">Room {roomNo} ({bedNo})</span>
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-xs mb-2">
                <div className="grid grid-cols-5 gap-1 size-16">
                  {[...Array(25)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-[1px] ${
                        i === 0 || i === 4 || i === 20 || i === 24 || (i * 13) % 2 === 0 
                          ? "bg-blue-950" 
                          : "bg-transparent"
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                Scan for Mess & Library Gate Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
