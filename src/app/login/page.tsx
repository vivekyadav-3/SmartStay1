"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loginWithKiitCredentials, setDemoRole } from "@/app/actions/user";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Kiit@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    if (!loginEmail.trim()) {
      setError("Please enter your KIIT email address (e.g. 22051934@kiit.ac.in)");
      return;
    }
    if (!loginPass) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    const res = await loginWithKiitCredentials(loginEmail, loginPass);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg(`Welcome, ${res.user?.name || "Student"}! Redirecting to SmartStay...`);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 700);
    }
  };

  const handleQuickStudentLogin = (studentEmail: string) => {
    setEmail(studentEmail);
    setPassword("Kiit@123");
    handleLogin(undefined, studentEmail, "Kiit@123");
  };

  const handleWardenLogin = async () => {
    setLoading(true);
    await setDemoRole("WARDEN");
    router.push("/dashboard/warden");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 flex flex-col justify-between text-slate-900">
      {/* Top University Ribbon */}
      <div className="bg-blue-900 px-4 py-2 text-center text-xs text-blue-100 flex items-center justify-center gap-2 border-b border-blue-800">
        <Sparkles className="size-3.5 text-blue-300" />
        <span className="font-semibold">KIIT Deemed to be University, Bhubaneswar</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hidden sm:inline">King's Palace (KP) & Queen's Castle (QC) Hostels</span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 p-6 text-white text-center relative">
            <div className="size-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">KIIT SmartStay Portal</h1>
            <p className="text-xs text-blue-200 mt-1">
              Hostel Digital Services · Single Sign-On
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-800/80 border border-blue-700 text-[10px] text-blue-100 font-medium">
              <ShieldCheck className="size-3 text-blue-300" />
              <span>Hostel KP-7 · Campus 12 Authority</span>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="size-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* KIIT Email */}
              {/* KIIT Roll Number or Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                  <span>KIIT Roll Number or Email</span>
                  <span className="text-[10px] font-normal text-slate-400">e.g. 2428021 or @kiit.ac.in</span>
                </label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Roll No (e.g. 2428021) or Email"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Password
                  </label>
                  <span className="text-[10px] font-semibold text-blue-700">
                    Default: Kiit@123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Kiit@123"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Notice regarding Kiit@123 default password */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <KeyRound className="size-3.5 text-blue-600" />
                  <span>4th Semester Student Directory (4,386 Students):</span>
                </div>
                <p className="text-slate-600 leading-tight">
                  Any student in the 4th Sem directory can log in using their <strong>Roll Number</strong> (e.g. <span className="font-mono text-blue-700">2428021</span>) or official KIIT Email with initial password <strong className="font-mono text-blue-700">Kiit@123</strong>. Your official name and room will load automatically.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md shadow-blue-600/20 text-xs sm:text-sm transition-all"
              >
                {loading ? "Authenticating..." : "Sign In to SmartStay"}
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </form>

            {/* Quick 1-Click Demo Accounts */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Fast 1-Click Evaluation Logins
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin("2428021")}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all"
                >
                  <p className="text-xs font-bold text-slate-800 truncate">Shreyan Dutta</p>
                  <p className="text-[10px] text-slate-500 font-mono">2428021</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin("2405001")}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all"
                >
                  <p className="text-xs font-bold text-slate-800 truncate">Abhiroop Borah</p>
                  <p className="text-[10px] text-slate-500 font-mono">2405001</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin("22051934@kiit.ac.in")}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all"
                >
                  <p className="text-xs font-bold text-slate-800 truncate">Vivek Yadav</p>
                  <p className="text-[10px] text-slate-500 font-mono">22051934</p>
                </button>
              </div>

              <button
                type="button"
                onClick={handleWardenLogin}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-blue-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Switch to Chief Warden Control Room →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        KIIT Deemed to be University • Bhubaneswar, Odisha • SmartStay Resident Portal 2026
      </footer>
    </div>
  );
}
