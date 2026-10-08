"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldAlert, Check, Loader2 } from "lucide-react";
import { setDemoRole } from "@/app/actions/user";

export function RoleSwitcher({ currentRole = "STUDENT" }: { currentRole?: string }) {
  const [activeRole, setActiveRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const roles = [
    {
      id: "STUDENT",
      label: "Student View",
      persona: "Vivek Yadav (KP-7)",
      icon: GraduationCap,
      path: "/dashboard",
      activeBg: "bg-blue-600 text-white shadow-sm",
    },
    {
      id: "WARDEN",
      label: "Warden View",
      persona: "Prof. S. K. Mohapatra",
      icon: ShieldAlert,
      path: "/dashboard/warden",
      activeBg: "bg-blue-950 text-white shadow-sm",
    },
  ];

  const handleRoleChange = (roleId: "STUDENT" | "WARDEN", path: string) => {
    setActiveRole(roleId);
    startTransition(async () => {
      await setDemoRole(roleId as any);
      router.push(path);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 hidden lg:inline">
        Role:
      </span>
      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = activeRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => handleRoleChange(r.id as any, r.path)}
            disabled={isPending}
            title={`Switch persona to ${r.persona}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? r.activeBg
                : "text-slate-600 hover:text-blue-900 hover:bg-slate-200/60"
            }`}
          >
            <Icon className="size-3.5" />
            <span>{r.label}</span>
            {isActive && (
              isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3 text-blue-200" />
            )}
          </button>
        );
      })}
    </div>
  );
}
