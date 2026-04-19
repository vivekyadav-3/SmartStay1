"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  MessageSquareWarning, 
  CalendarClock, 
  UserSquare2,
  IndianRupee
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Complaints", href: "/dashboard/complaints", icon: MessageSquareWarning },
  { name: "Laundry", href: "/dashboard/laundry", icon: CalendarClock },
  { name: "Visitor Pass", href: "/dashboard/visitor-pass", icon: UserSquare2 },
  { name: "Payments & Fees", href: "/dashboard/fees", icon: IndianRupee },
  { name: "Profile", href: "/dashboard/profile", icon: ShieldCheck },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link className="flex items-center gap-2" href="/dashboard">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">SmartStay</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon className={cn("size-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "size-8" } }} />
          <span className="text-sm font-medium text-muted-foreground">My Account</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">SmartStay</span>
            </div>
            <UserButton afterSignOutUrl="/" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
