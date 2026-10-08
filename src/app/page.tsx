import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  BookOpen, 
  Wrench, 
  Megaphone, 
  UtensilsCrossed, 
  ArrowRight, 
  Sparkles,
  Star,
  CheckCircle2,
  GraduationCap,
  WashingMachine as WashingIcon,
  Siren,
  ShieldCheck
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Top University Ribbon */}
      <div className="bg-blue-900 px-4 py-2 text-center text-xs text-blue-100 flex items-center justify-center gap-2 border-b border-blue-800">
        <Sparkles className="size-3.5 text-blue-300" />
        <span className="font-semibold">KIIT Deemed to be University, Bhubaneswar</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hidden sm:inline">King's Palace (KP) & Queen's Castle (QC) Smart Hostel Management</span>
      </div>

      {/* Header */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50 shadow-xs">
        <Link className="flex items-center gap-3 group" href="/">
          <div className="size-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-blue-950 flex items-center gap-2">
              KIIT SmartStay
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 py-0 font-bold">
                KP-7 Edition
              </Badge>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Digital Hostel Infrastructure & Student Portal
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          <Link href="/dashboard" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors hidden sm:block">
            Student Dashboard
          </Link>
          <Link href="/dashboard/gate-pass" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors hidden md:block">
            Library Pass
          </Link>
          <Link href="/dashboard/announcements" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors hidden md:block">
            Notice Board
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 text-xs font-bold shadow-md shadow-blue-600/20">
              Open Portal <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative overflow-hidden">
        <section className="w-full py-16 md:py-24 lg:py-28 flex justify-center text-center px-4 bg-gradient-to-b from-blue-50/60 to-slate-50">
          <div className="max-w-4xl flex flex-col items-center gap-5">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 border-blue-200 text-xs font-bold flex items-center gap-2">
              <GraduationCap className="size-4 text-blue-600" />
              <span>Campus 12 Hostel Digital Management • Academic Year 2026</span>
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-blue-950 leading-tight">
              Hostel Living, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                Simpler, Faster & Connected.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Designed for non-tech-savvy wardens and fast everyday student use: apply for <strong>Central Library Passes</strong> with 08:30 PM curfew, check <strong>Washing Machine Live Availability</strong> and pre-book 1-hour early, view the <strong>Digital Notice Board</strong> without walking to reception, file <strong>Room Complaints</strong> with verification, and dispatch <strong>Medical Emergency SOS</strong> instantly.
            </p>

            {/* Quick Demo Launch Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full sm:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 text-sm font-bold shadow-lg shadow-blue-600/20 gap-2">
                  Launch Student Portal <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/dashboard/warden" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 h-12 text-sm font-bold border-slate-300 bg-white text-slate-800 hover:bg-slate-50">
                  Open Warden Control Room
                </Button>
              </Link>
            </div>

            {/* Metric Highlights */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl text-left border-t border-slate-200 mt-5">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-lg font-black text-blue-950">08:30 PM</span>
                <p className="text-[11px] text-slate-500 font-medium">Library Pass Curfew</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-lg font-black text-blue-950">≥ 1h Early</span>
                <p className="text-[11px] text-slate-500 font-medium">Machine Pre-Booking</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-lg font-black text-blue-950">Live SOS</span>
                <p className="text-[11px] text-slate-500 font-medium">Ambulance Dispatch</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-lg font-black text-blue-950">⭐ 4.4 / 5</span>
                <p className="text-[11px] text-slate-500 font-medium">Daily Mess Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Essential 6 Features */}
        <section className="w-full py-16 bg-white border-y border-slate-200 px-6 lg:px-14">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-1 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                Core Hostel Living Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Laser-focused on solving everyday student friction and keeping communication clear.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Central Library Pass */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 group">
                <div className="size-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <BookOpen className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">1. Central Library Pass</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast 1-click application for evening reading room visits at Campus 6 Central Library. Strict 08:30 PM curfew countdown with digital QR code verification.
                </p>
                <Link href="/dashboard/gate-pass" className="inline-flex items-center text-xs font-bold text-blue-600 gap-1 hover:underline pt-1">
                  Apply for Library Pass <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 2: Washing Machine Availability */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 group">
                <div className="size-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <WashingIcon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">2. Washing Machine Slots</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time machine occupancy (Vacant vs Occupied). Pre-book your slot at least 1-hour early so you get an exclusive pin without repeatedly walking down to the laundry room.
                </p>
                <Link href="/dashboard/laundry" className="inline-flex items-center text-xs font-bold text-blue-600 gap-1 hover:underline pt-1">
                  Check Laundry Room <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 3: Digital Notice Board */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 group">
                <div className="size-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Megaphone className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">3. Digital Notice Board</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wardens post special Sunday menus, sports tournaments, and maintenance circulars directly to the portal. Never walk down to reception to read paper notices again!
                </p>
                <Link href="/dashboard/announcements" className="inline-flex items-center text-xs font-bold text-blue-600 gap-1 hover:underline pt-1">
                  Read Notices <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 4: Student Complaints */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 group">
                <div className="size-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Wrench className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">4. Student Complaints</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Input Hostel Name, Room No, Student Name, and Roll No. Directly dispatched to maintenance staff with a secure closure OTP so issues are resolved properly.
                </p>
                <Link href="/dashboard/complaints" className="inline-flex items-center text-xs font-bold text-blue-600 gap-1 hover:underline pt-1">
                  File Complaint <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 5: Mess Food Review */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 group">
                <div className="size-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UtensilsCrossed className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">5. Mess Food Review</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Daily ratings on taste, cleanliness, and portion quantity. Transparent resident feedback reviewed by the Mess Committee to maintain high food standards.
                </p>
                <Link href="/dashboard/food-review" className="inline-flex items-center text-xs font-bold text-blue-600 gap-1 hover:underline pt-1">
                  Review Today's Meal <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Feature 6: Medical SOS & Ambulance */}
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 hover:border-red-300 transition-all space-y-3 group">
                <div className="size-11 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Siren className="size-5 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-red-950">6. Ambulance & Medical SOS</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  One-tap medical emergency beacon. The patient dispatches an alert with room coordinates, immediately alerting the Warden Desk to call the campus ambulance.
                </p>
                <Link href="/dashboard" className="inline-flex items-center text-xs font-bold text-red-700 gap-1 hover:underline pt-1">
                  Access SOS Beacon <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-slate-500 text-xs text-center space-y-1">
        <p className="font-bold text-slate-800">
          KIIT SmartStay • King's Palace 7 (Campus 12), Bhubaneswar
        </p>
        <p>
          Digital Hostel Infrastructure Prototype • B.Tech Computer Science & Engineering
        </p>
      </footer>
    </div>
  );
}
