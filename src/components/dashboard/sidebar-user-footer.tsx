"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle, LogIn } from "lucide-react";
import { logoutStudent, getCurrentUser } from "@/app/actions/user";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  studentProfile?: {
    rollNo?: string | null;
    roomNo?: string | null;
    hostel?: {
      code?: string | null;
      name?: string | null;
    } | null;
  } | null;
}

export function SidebarUserFooter({ onAction }: { onAction?: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then((u) => {
        if (isMounted) {
          setUser(u as UserProfile | null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutStudent();
    if (onAction) onAction();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-full bg-slate-200" />
          <div className="space-y-1">
            <div className="w-20 h-3 bg-slate-200 rounded" />
            <div className="w-14 h-2 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <UserCircle className="size-7 text-slate-400" />
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-700">Guest Visitor</p>
            <p className="text-[10px] text-slate-400">Not Logged In</p>
          </div>
        </div>
        <Link
          href="/login"
          onClick={onAction}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-bold shadow-xs transition-colors"
        >
          <LogIn className="size-3" />
          <span>Sign In</span>
        </Link>
      </div>
    );
  }

  const initial = user.name?.charAt(0).toUpperCase() || "S";
  let subtitle = "Resident";
  if (user.role === "WARDEN") {
    subtitle = "Chief Warden · KP-7";
  } else if (user.role === "HEAD_WARDEN") {
    subtitle = "Dean / Head Warden";
  } else if (user.role === "SECURITY") {
    subtitle = "Security Post · Gate 1";
  } else if (user.studentProfile) {
    const hostelCode = user.studentProfile.hostel?.code || "KP-7";
    const room = user.studentProfile.roomNo || "Room";
    subtitle = `${hostelCode} · Room ${room}`;
  }

  return (
    <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
            {initial}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold truncate text-slate-800">
              {user.name || "Student Resident"}
            </p>
            <p className="text-[10px] text-blue-700 font-medium truncate">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/dashboard/profile"
            onClick={onAction}
            className="px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 text-[10px] font-bold transition-colors"
            title="View Student ID Card"
          >
            ID Card
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out of SmartStay"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
