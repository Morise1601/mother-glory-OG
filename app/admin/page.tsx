"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { firstAccessibleAdminPage } from '@/lib/auth/access';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if session exists
  useEffect(() => {
    try {
      const supabase = createBrowserClient();
      const authError = new URL(window.location.href).searchParams.get('error');
      supabase.auth.getUser().then(async ({ data }) => {
        if (new URL(window.location.href).searchParams.has('password_updated')) setSuccess('Your password has been updated. Sign in with your new password.');
        if (authError === 'access_denied') setError('Your account does not have access to this area. Contact the administrator.');
        if (authError === 'auth_exchange_failed') setError('This sign-in link has expired or is invalid. Request a new link.');
        if (data.user && !authError) {
          const response = await fetch('/api/admin/session', { cache: 'no-store' });
          if (response.ok) { const { actor } = await response.json(); router.replace(firstAccessibleAdminPage(actor)); }
        }
      }).catch(() => undefined);
    } catch {
      // ignore
    }
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Please enter both email address and password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserClient();
      let normalizedEmail = email.trim().toLowerCase();

      // Normalize superadmin username aliases to institutional administrator email
      if (
        normalizedEmail === "superadmin" ||
        normalizedEmail === "admin" ||
        normalizedEmail === "super-admin" ||
        normalizedEmail === "superadmin@motherglory.edu"
      ) {
        normalizedEmail = "admin@motherglory.edu";
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (authError) {
        setError('Unable to sign in. Check your email and password and try again.');
        setLoading(false);
        return;
      }

      if (data?.session) {
        const response = await fetch('/api/admin/session', { cache: 'no-store' });
        if (!response.ok) {
          await supabase.auth.signOut();
          setError('An active staff account with an assigned role is required. Contact the administrator.');
          setLoading(false);
          return;
        }
        setSuccess("Authentication successful! Redirecting to dashboard...");
        const { actor } = await response.json();
        router.replace(firstAccessibleAdminPage(actor));
        router.refresh();
      }
    } catch (err: unknown) {
      void err;
      setError('Unable to sign in right now. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF8F3]">
      {/* Left Navy Brand Panel (L01) */}
      <div className="lg:w-1/2 bg-[#122452] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1b3260]">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center">
            <Image
              src="/images/logo_mg.png"
              alt="Mother Glory Logo"
              width={42}
              height={42}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-white block leading-tight">
              Mother Glory
            </span>
            <span className="text-xs text-slate-300 uppercase tracking-wider block">
              Coaching & Tutorial Centre
            </span>
          </div>
        </div>

        <div className="my-12 lg:my-0 space-y-6 max-w-lg">
          <span className="text-xs font-semibold tracking-widest text-[#B68A35] uppercase block">
            DISCIPLINE • GUIDANCE • HIGHER GOALS
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            For a Brighter Tomorrow
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the centralized administration interface for Mother Glory Coaching & Tutorial Centre. Manage verified student achievements, curriculum programs, homepage banners, and admission enquiries across Puducherry and Karaikal campuses.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} Mother Glory Coaching & Tutorial Centre. Authorized staff access only.
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#DFE3EA] p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="relative h-14 w-14 bg-[#FAF8F3] border border-[#DFE3EA] rounded-2xl p-2 mx-auto flex items-center justify-center">
              <Image
                src="/images/logo_mg.png"
                alt="Mother Glory Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#122452]">
              Staff Access
            </h2>
            <p className="text-xs text-[#596579]">
              Enter your institutional credentials to access the management portal.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Address / Username */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#122452] mb-1">
                Email address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="login-email"
                  autoComplete="username"
                  placeholder="admin@motherglory.edu or superadmin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#122452]">
                  Password
                </label>
                <Link
                  href="/admin/forgot-password"
                  className="text-[11px] text-[#B68A35] hover:text-[#9c7328] font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="show-pass-checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#B68A35] focus:ring-[#B68A35]"
              />
              <label htmlFor="show-pass-checkbox" className="text-xs text-[#596579] cursor-pointer">
                Show password
              </label>
            </div>

            {/* Super Admin Quick Access Info Card */}
            <div className="p-3.5 bg-[#FAF8F3] border border-[#DFE3EA] rounded-2xl text-[11px] text-[#596579] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#122452]">Super Admin Credentials</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@motherglory.edu");
                    setPassword("Admin@MotherGlory2026!");
                  }}
                  className="text-[#B68A35] hover:text-[#9c7328] font-bold text-xs underline cursor-pointer"
                >
                  Quick Fill
                </button>
              </div>
              <p>User: <code className="text-[#122452] font-mono bg-white px-1.5 py-0.5 rounded border border-[#DFE3EA]">admin@motherglory.edu</code> or <code className="text-[#122452] font-mono bg-white px-1.5 py-0.5 rounded border border-[#DFE3EA]">superadmin</code></p>
              <p>Password: <code className="text-[#122452] font-mono bg-white px-1.5 py-0.5 rounded border border-[#DFE3EA]">Admin@MotherGlory2026!</code></p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
