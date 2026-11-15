"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { verifyPasswordSetupSession } from '@/lib/auth/password-session';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const sessionCheck = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    sessionCheck.current ??= verifyPasswordSetupSession(createBrowserClient, window.location.href, url => window.history.replaceState(window.history.state, '', url));
    sessionCheck.current
      .then(() => { if (!cancelled) setSessionValid(true); })
      .catch(error => { if (!cancelled) setError(error.message); })
      .finally(() => { if (!cancelled) setCheckingSession(false); });
    return () => { cancelled = true; };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!sessionValid) { setError('A valid setup or recovery session is required.'); return; }

    if (newPassword.length < 8 || newPassword.length > 128) {
      setError("Password must contain between 8 and 128 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password. Session may have expired.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      await supabase.auth.signOut({ scope: 'global' });
      setTimeout(() => {
        router.replace("/admin?password_updated=1");
        router.refresh();
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resetting password.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#DFE3EA] p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="relative h-12 w-12 bg-[#FAF8F3] border border-[#DFE3EA] rounded-2xl p-1.5 mx-auto flex items-center justify-center">
            <Image
              src="/images/logo_mg.png"
              alt="Mother Glory Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#122452]">
            Set New Password
          </h1>
          <p className="text-xs text-[#596579]">
            Create a secure password for your staff administrative account.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="font-semibold text-sm">Password Updated Successfully</p>
            <p className="text-xs text-emerald-800">
              Your password has been changed. Redirecting to admin sign in...
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="new-pass" className="block text-xs font-semibold text-[#122452] mb-1">
                New Password (minimum 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-pass"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  disabled={!sessionValid}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-xs font-semibold text-[#122452] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-pass"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  disabled={!sessionValid}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !sessionValid || checkingSession}
              className="w-full py-3 px-4 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <span>{checkingSession ? 'Verifying recovery link…' : 'Update Password'}</span>
              )}
            </button>
          </form>
        )}
        {!sessionValid && !checkingSession && <Link href="/admin/forgot-password" className="block text-xs underline text-[#122452]">Request a new recovery link</Link>}
      </div>
    </div>
  );
}

