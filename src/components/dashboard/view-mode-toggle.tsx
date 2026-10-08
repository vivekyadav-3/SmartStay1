"use client";

import { useState, useEffect } from "react";
import { Monitor, Smartphone } from "lucide-react";

export function ViewModeToggle({ variant = "header" }: { variant?: "header" | "drawer" | "floating" }) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect if physical screen is a mobile / tablet device
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024 || /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Synchronize across multiple toggle instances on the same page
    const handleModeSync = (e: Event) => {
      const customEvt = e as CustomEvent<"mobile" | "desktop">;
      if (customEvt.detail) {
        setViewMode(customEvt.detail);
      }
    };
    window.addEventListener("kiit_view_mode_change", handleModeSync);

    // Restore saved view preference
    const saved = localStorage.getItem("kiit_view_mode") as "mobile" | "desktop" | null;
    if (saved === "desktop") {
      applyViewMode("desktop", false);
    } else {
      applyViewMode("mobile", false);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("kiit_view_mode_change", handleModeSync);
    };
  }, []);

  const applyViewMode = (mode: "mobile" | "desktop", dispatch = true) => {
    setViewMode(mode);
    if (typeof document === "undefined") return;

    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }

    if (mode === "desktop") {
      document.documentElement.classList.add("forced-desktop");
      document.body.classList.add("forced-desktop");
      // Scale down viewport for mobile devices to comfortably fit full 1200px desktop
      const screenW = typeof window !== "undefined" ? window.screen.width : 390;
      const initialScale = Math.max(0.25, Math.min(1, Number((screenW / 1200).toFixed(2))));
      meta.setAttribute(
        "content",
        `width=1200, initial-scale=${initialScale}, minimum-scale=0.25, maximum-scale=3.0, user-scalable=yes`
      );
      localStorage.setItem("kiit_view_mode", "desktop");
    } else {
      document.documentElement.classList.remove("forced-desktop");
      document.body.classList.remove("forced-desktop");
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
      );
      localStorage.setItem("kiit_view_mode", "mobile");
    }

    if (dispatch && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kiit_view_mode_change", { detail: mode }));
    }
  };

  const toggleMode = () => {
    const nextMode = viewMode === "mobile" ? "desktop" : "mobile";
    applyViewMode(nextMode);
  };

  if (!mounted) return null;

  // Header compact toggle button
  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={toggleMode}
        title={viewMode === "mobile" ? "Switch to Desktop View" : "Switch to Mobile View"}
        aria-label={viewMode === "mobile" ? "Switch to Desktop View" : "Switch to Mobile View"}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs ${
          viewMode === "desktop"
            ? "bg-blue-900 text-white border-blue-700 shadow-blue-900/20"
            : "bg-blue-50/80 text-blue-900 border-blue-200 hover:bg-blue-100"
        }`}
      >
        {viewMode === "mobile" ? (
          <>
            <Monitor className="size-3.5 text-blue-700" />
            <span className="text-[11px]">Desktop View</span>
          </>
        ) : (
          <>
            <Smartphone className="size-3.5 text-blue-300" />
            <span className="text-[11px]">Mobile View</span>
          </>
        )}
      </button>
    );
  }

  // Drawer full-width switch inside the hamburger mobile menu
  if (variant === "drawer") {
    return (
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
          <span>Display Mode</span>
          <span className="text-blue-700 font-mono font-semibold">
            {viewMode === "desktop" ? "Desktop (1200px)" : "Mobile Touch"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => applyViewMode("mobile")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              viewMode === "mobile"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Smartphone className="size-3.5" />
            <span>Mobile View</span>
          </button>
          <button
            type="button"
            onClick={() => applyViewMode("desktop")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              viewMode === "desktop"
                ? "bg-blue-900 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Monitor className="size-3.5" />
            <span>Desktop View</span>
          </button>
        </div>
      </div>
    );
  }

  // Floating pill button (available on mobile/tablet viewports)
  if (variant === "floating") {
    if (!isMobileDevice && viewMode === "mobile") return null;

    return (
      <aside aria-label="View mode controls" className="fixed bottom-4 right-4 z-[9990] flex items-center">
        <button
          type="button"
          onClick={toggleMode}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-xl border transition-all active:scale-95 ${
            viewMode === "desktop"
              ? "bg-blue-900 text-white border-blue-400 hover:bg-blue-800 shadow-blue-950/40"
              : "bg-white text-blue-900 border-blue-200 hover:bg-blue-50 shadow-slate-900/15"
          }`}
          title={viewMode === "desktop" ? "Return to Mobile View" : "Switch to Desktop View"}
        >
          {viewMode === "desktop" ? (
            <>
              <Smartphone className="size-4 text-sky-300" />
              <span>📱 Return to Mobile View</span>
            </>
          ) : (
            <>
              <Monitor className="size-4 text-blue-600" />
              <span>💻 Desktop View</span>
            </>
          )}
        </button>
      </aside>
    );
  }

  return null;
}
