"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  UtensilsCrossed,
  Clock,
  MessageSquareWarning, 
  CalendarClock, 
  Megaphone,
  Star,
  UserSquare2,
  IndianRupee,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  LayoutDashboard,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";

const residentLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Gate Pass", href: "/dashboard/timings", icon: Clock },
  { name: "Profile", href: "/dashboard/profile", icon: ShieldCheck },
];

const managementLinks = [
  { name: "Warden Approval", href: "/dashboard/warden", icon: ShieldAlert, badge: "Warden" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-72 border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl flex flex-col hidden md:flex shrink-0">
        {/* KIIT Header Brand */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 bg-emerald-950/20">
          <Link className="flex items-center gap-3 group" href="/dashboard">
            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                KIIT SmartStay
              </span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">
                Bhubaneswar Hostels
              </span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Resident Portal
          </p>
          {residentLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                  isActive 
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="truncate">{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 pb-1">
            <p className="px-3 py-1 text-[10px] font-bold text-amber-400/90 uppercase tracking-widest flex items-center gap-1.5">
              <span>Admin & Security</span>
            </p>
          </div>

          {managementLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group",
                  isActive 
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-amber-400" : "text-amber-400/70 group-hover:text-amber-300")} />
                  <span className="truncate">{link.name}</span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground font-mono">
                  {link.badge}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "size-8" } }} />
            <div className="truncate">
              <p className="text-xs font-semibold truncate text-foreground">KIIT Student</p>
              <p className="text-[10px] text-emerald-400 font-mono">Campus 12</p>
            </div>
          </div>
          <Link href="/dashboard/profile" title="View Digital ID">
            <span className="size-2 rounded-full bg-emerald-400 block animate-pulse" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl flex items-center justify-between px-4 md:hidden z-30">
          <div className="flex items-center gap-2.5">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm">KIIT SmartStay</span>
            </div>
          </div>
          <UserButton />
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-20 bg-background/95 backdrop-blur-2xl p-4 flex flex-col md:hidden overflow-y-auto border-t border-white/10">
            <nav className="space-y-1 pb-10">
              <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Resident Portal
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                      isActive 
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", isActive ? "text-emerald-400" : "text-muted-foreground")} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Admin & Security
              </p>
              {managementLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      isActive 
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 shrink-0 text-amber-400" />
                      <span>{link.name}</span>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 font-mono">
                      {link.badge}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           {children}
        </div>
      </main>
    </div>
  );
}
