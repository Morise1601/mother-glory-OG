"use client";

import { useState } from "react";
import { X, Send, CheckCircle2, Phone, MessageSquare, Sparkles } from "lucide-react";
import { enquirySchema } from "@/lib/validation/schemas";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export default function EnquiryModal({ isOpen, onClose, defaultProgram }: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    program: defaultProgram || "NEET Classroom Coaching",
    campus: "Puducherry",
    message: "",
    privacyConsent: false,
    institutionRef: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submissionKey, setSubmissionKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = enquirySchema.safeParse(formData);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    try {
      const idempotencyKey = submissionKey || crypto.randomUUID();
      setSubmissionKey(idempotencyKey);
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, idempotencyKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit. Please try again.");
      setSubmitted(true);
      setSubmissionKey(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#122452] via-[#1b3260] to-red-600 p-5 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-amber-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-sm font-bold tracking-wider uppercase text-amber-300 block">
                  Mother Glory NEET Academy
                </span>
                <h3 className="text-lg font-sora font-semibold leading-tight">
                  Admissions Enquiry 2025-26
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-sora font-bold text-slate-900">
                Enquiry Submitted Successfully!
              </h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Thank you, <span className="font-semibold text-slate-900">{formData.name || "Aspirant"}</span>. Our academic counselor will call you on <span className="font-semibold text-slate-900">{formData.phone}</span> within 24 hours.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://wa.me/919789043210?text=Hi%20Mother%20Glory%20Academy%2C%20I%20just%20submitted%20an%20enquiry%20for%20${encodeURIComponent(formData.program)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Us on WhatsApp</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter student's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 97890 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Select Programme
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                  >
                    <option value="NEET Classroom Coaching">NEET Classroom Coaching (1-2 Yr)</option>
                    <option value="NEET Crash Course">NEET Crash Course</option>
                    <option value="Test Series & Evaluation">Test Series & Evaluation</option>
                    <option value="NCERT Focus Programme">NCERT Focus Programme</option>
                    <option value="NEET Repeater Batch">NEET Repeater / Dropper Batch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Campus
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                  >
                    <option value="Puducherry">Puducherry</option>
                    <option value="Karaikal">Karaikal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Message / Query (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ask about batch timings, fees, hostel, or scholarships..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <label className="flex gap-2 text-xs text-slate-600"><input type="checkbox" required checked={formData.privacyConsent} onChange={event => setFormData({ ...formData, privacyConsent: event.target.checked })} /><span>I agree to the <a href="/privacy-policy" className="underline">privacy policy</a> and consent to being contacted about my enquiry.</span></label>
              <input aria-hidden="true" tabIndex={-1} autoComplete="off" name="institutionRef" className="hidden" value={formData.institutionRef} onChange={event => setFormData({ ...formData, institutionRef: event.target.value })} />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{submitting ? "Submitting…" : "Submit Admission Enquiry"}</span>
              </button>

              <div className="pt-2 text-center">
                <span className="text-sm text-slate-500">
                  Prefer direct call?{" "}
                  <a href="tel:+919789043210" className="text-red-600 font-bold hover:underline">
                    Call Admissions at +91 97890 43210
                  </a>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
