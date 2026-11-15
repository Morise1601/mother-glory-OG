"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (recoveryError) throw recoveryError;
      setSubmitted(true);
    } catch {
      setError('Unable to send a recovery link right now. Please try again later.');
    } finally {
      // Always show neutral recovery acknowledgement to avoid user enumeration
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
            Password Recovery
          </h1>
          <p className="text-xs text-[#596579]">
            Enter your institutional email address to receive password reset instructions.
          </p>
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800">{error}</p>}

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Recovery Request Processed</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              If an active staff account exists for <strong>{email}</strong>, a secure password recovery link has been dispatched. Please check your inbox and spam folders.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#122452] hover:text-[#B68A35] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="recovery-email" className="block text-xs font-semibold text-[#122452] mb-1">
                Registered Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="recovery-email"
                  placeholder="staff@motherglory.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Recovery Link</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-[#596579] hover:text-[#122452] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

