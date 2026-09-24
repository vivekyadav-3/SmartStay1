"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldAlert, ShieldCheck, Check, Loader2 } from "lucide-react";
import { setDemoRole } from "@/app/actions/user";

export function RoleSwitcher({ currentRole = "STUDENT" }: { currentRole?: string }) {
  const [activeRole, setActiveRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const roles = [
    {
      id: "STUDENT",
      label: "Student",
      persona: "Vivek Yadav (KP-7)",
      icon: GraduationCap,
      path: "/dashboard",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      activeBg: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30",
    },
    {
      id: "WARDEN",
      label: "Warden",
      persona: "Prof. S. K. Mohapatra",
      icon: ShieldAlert,
      path: "/dashboard/warden",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      activeBg: "bg-amber-600 text-white shadow-lg shadow-amber-600/30",
    },
    {
      id: "SECURITY",
      label: "Security Gate",
      persona: "Havildar R. K. Swain",
      icon: ShieldCheck,
      path: "/dashboard/security-gate",
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      activeBg: "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
    },
  ];

  const handleRoleChange = (roleId: "STUDENT" | "WARDEN" | "SECURITY", path: string) => {
    setActiveRole(roleId);
    startTransition(async () => {
      await setDemoRole(roleId);
      router.push(path);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Demo Persona:</span>
      </div>

      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id as any, r.path)}
              disabled={isPending}
              title={`Switch persona to ${r.persona}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? r.activeBg
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{r.label}</span>
              {isActive && (
                isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
