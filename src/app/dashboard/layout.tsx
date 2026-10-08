"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Megaphone, 
  Wrench, 
  WashingMachine as WashingIcon, 
  UtensilsCrossed, 
  LayoutDashboard, 
  Building2, 
  Menu, 
  X, 
  ShieldAlert, 
  UserCircle,
  Sparkles,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";
import { EmergencyModal } from "@/components/dashboard/emergency-modal";
import { SidebarFeedbackBox } from "@/components/dashboard/sidebar-feedback-box";
import { ViewModeToggle } from "@/components/dashboard/view-mode-toggle";
import { SidebarUserFooter } from "@/components/dashboard/sidebar-user-footer";

const residentLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Library Pass", href: "/dashboard/gate-pass", icon: BookOpen, badge: "Curfew 08:30" },
  { name: "Notice Board", href: "/dashboard/announcements", icon: Megaphone, badge: "Events" },
  { name: "Student Complaints", href: "/dashboard/complaints", icon: Wrench, badge: "Room Issues" },
  { name: "Washing Machines", href: "/dashboard/laundry", icon: WashingIcon, badge: "Live Status" },
  { name: "Mess Food Review", href: "/dashboard/food-review", icon: UtensilsCrossed, badge: "Daily Menu" },
  { name: "Resident Profile & ID", href: "/dashboard/profile", icon: UserCircle },
];

const wardenLinks = [
  { 
    name: "Warden Control Room", 
    href: "/dashboard/warden", 
    icon: ShieldAlert, 
    badge: "All Actions",
    desc: "Pass Approvals · SOS · Machines · Complaints · Notices" 
  },
  { 
    name: "App Feedback & Ratings", 
    href: "/dashboard/feedback", 
    icon: Star, 
    badge: "79 Reviews",
    desc: "Student Reviews Audit & Star Satisfaction" 
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Desktop Sidebar: Clean White & Dark Blue Palette */}
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col hidden md:flex shrink-0 shadow-sm z-20">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
          <Link className="flex items-center gap-3 group" href="/dashboard">
            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                KIIT SmartStay
              </span>
              <span className="text-[10px] text-blue-200 font-medium tracking-wide uppercase">
                Hostel KP-7 · Campus 12
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Resident Services
            </p>
          </div>

          {residentLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:text-blue-900 hover:bg-blue-50/70"
                )}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                    )}
                  />
                  <span className="truncate">{link.name}</span>
                </div>
                {link.badge && (
                  <span
                    className={cn(
                      "text-[9px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded",
                      isActive
                        ? "bg-blue-700/60 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700"
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Student Feedback Box in Left Panel (Usersnap style) */}
          <div className="pt-2 pb-1">
            <SidebarFeedbackBox />
          </div>

          <div className="pt-3 pb-1">
            <p className="px-3 py-1 text-[10px] font-bold text-blue-900 uppercase tracking-widest flex items-center gap-1.5">
              <span>Authority Portal</span>
            </p>
          </div>

          {wardenLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex flex-col gap-1 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group border",
                  isActive
                    ? "bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-900/20"
                    : "bg-blue-50/50 text-blue-950 border-blue-200/70 hover:bg-blue-100/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-blue-700")} />
                    <span>{link.name}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded",
                      isActive ? "bg-blue-800 text-blue-100" : "bg-blue-200/80 text-blue-900"
                    )}
                  >
                    {link.badge}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-normal leading-tight pl-7",
                    isActive ? "text-blue-200" : "text-slate-500"
                  )}
                >
                  {link.desc}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Profile & Role Switch */}
        <SidebarUserFooter />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        {/* Top Institutional Header Bar with Emergency SOS & View Mode Switcher */}
        <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 md:px-8 z-30 shrink-0 shadow-xs">
          {/* Mobile menu button and brand title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 md:hidden text-slate-700 shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="flex items-center gap-2 truncate">
              <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                KP7
              </div>
              <div className="truncate">
                <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-blue-950 tracking-tight leading-none truncate">
                  KIIT SmartStay
                </h1>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-1 truncate">
                  Hostel KP-7 · Campus 12
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions: View Mode Switcher, Medical SOS, and Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Mode Switcher (📱 Mobile / 💻 Desktop) */}
            <ViewModeToggle variant="header" />

            {/* Prominent Ambulance / Medical SOS Button */}
            <EmergencyModal />

            {/* Role Switcher */}
            <div className="hidden sm:block">
              <RoleSwitcher />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-white p-4 flex flex-col md:hidden overflow-y-auto border-t border-slate-200 animate-in slide-in-from-top-4 space-y-3">
            {/* Display Mode Switcher inside Drawer */}
            <ViewModeToggle variant="drawer" />

            <div>
              <RoleSwitcher />
            </div>
            <nav className="space-y-1.5">
              <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Resident Services
              </p>
              {residentLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/10">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-2 pb-1">
                <SidebarFeedbackBox />
              </div>

              <p className="px-3 pt-3 py-1 text-[10px] font-bold text-blue-900 uppercase tracking-widest">
                Warden Portal
              </p>
              {wardenLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      isActive ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-950 hover:bg-blue-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 shrink-0 text-blue-700" />
                      <span>{link.name}</span>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-200 text-blue-900">
                      {link.badge}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-2 border-t border-slate-100">
              <SidebarUserFooter onAction={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Scrollable Page Body with Clean Blue-White Background */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>

        {/* Floating View Mode Switcher for Mobile Devices */}
        <ViewModeToggle variant="floating" />
      </main>
    </div>
  );
}
