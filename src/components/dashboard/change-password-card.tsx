"use client";

import { useState } from "react";
import { KeyRound, CheckCircle2, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { changeStudentPassword } from "@/app/actions/user";

export function ChangePasswordCard({ isDefault = true }: { isDefault?: boolean }) {
  const [currentPassword, setCurrentPassword] = useState(isDefault ? "Kiit@123" : "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!currentPassword) {
      setError("Please enter your current password (default: Kiit@123)");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const res = await changeStudentPassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <KeyRound className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Security & Password Management
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Change password from the default <span className="font-mono font-bold text-blue-700">Kiit@123</span>
              </CardDescription>
            </div>
          </div>
          {isDefault && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Default Password Active
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {success ? (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-2">
            <div className="size-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-5" />
            </div>
            <h4 className="text-xs font-bold text-blue-950">Password Successfully Updated!</h4>
            <p className="text-[11px] text-blue-800">
              Your password has been changed securely. Use your new password for future SmartStay logins.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSuccess(false)}
              className="text-xs mt-1 border-blue-200 text-blue-800 hover:bg-blue-100"
            >
              Update Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="size-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Current Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Kiit@123"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-[11px] text-slate-500 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                {showPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                <span>{showPass ? "Hide" : "Show"} password characters</span>
              </button>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 h-9 shadow-sm"
              >
                {isSubmitting ? "Updating..." : "Save New Password"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
