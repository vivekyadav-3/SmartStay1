"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="size-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
        <AlertCircle className="size-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">
        Hostel Service Temporary Refresh
      </h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The resident system is synchronizing live data. Click below to refresh your session or return to the overview.
      </p>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
        >
          <RefreshCw className="size-4" />
          Retry Connection
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" className="border-slate-300 text-slate-700 flex items-center gap-2">
            <Home className="size-4" />
            Dashboard Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
