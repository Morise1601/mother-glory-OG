"use client";

import { useState } from "react";
import { Campus, Program } from "@/types/content.types";
import { useSiteSettings } from "./SiteSettingsProvider";
import { EnquiryFormData, enquirySchema } from "@/lib/validation/schemas";
import { CheckCircle2, AlertCircle, Loader2, Send, MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

interface ContactFormProps {
  campuses: Campus[];
  programs?: Program[];
  defaultProgram?: string;
  defaultCampus?: "Puducherry" | "Karaikal";
}

export default function ContactForm({
  campuses,
  programs = [],
  defaultProgram = "Admissions information",
  defaultCampus = "Puducherry",
}: ContactFormProps) {
  const settings = useSiteSettings();
  const [selectedCampusSlug, setSelectedCampusSlug] = useState<string>(
    defaultCampus.toLowerCase() === "karaikal" ? "karaikal" : "puducherry"
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    program: defaultProgram,
    campus: defaultCampus as "Puducherry" | "Karaikal",
    message: "",
    privacyConsent: false,
    institutionRef: "", // honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submissionKey, setSubmissionKey] = useState<string | null>(null);

  const activeCampus =
    campuses.find((c) => c.slug.toLowerCase() === selectedCampusSlug.toLowerCase()) || campuses[0];

  const handleCampusChange = (slug: string) => {
    setSelectedCampusSlug(slug);
    setFormData((prev) => ({
      ...prev,
      campus: slug === "karaikal" ? "Karaikal" : "Puducherry",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Client-side validation with Zod
    const validationResult = enquirySchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const idempotencyKey = submissionKey || crypto.randomUUID();
      setSubmissionKey(idempotencyKey);
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validationResult.data,
          idempotencyKey,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setServerError(resData.error || "Failed to submit enquiry. Please verify details and retry.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setSubmissionKey(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        program: defaultProgram,
        campus: defaultCampus,
        message: "",
        privacyConsent: false,
        institutionRef: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "A connection error occurred. Please try again.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left: Campus Information & Interactive Map (5 columns) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Campus Selector Tabs */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-[#DFE3EA] shadow-xs">
          {campuses.map((c) => {
            const isSelected = c.slug.toLowerCase() === selectedCampusSlug.toLowerCase();
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCampusChange(c.slug)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-[#122452] text-white shadow-xs"
                    : "text-[#596579] hover:text-[#122452]"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Selected Campus Card */}
        {activeCampus && (
          <div className="bg-white rounded-2xl border border-[#DFE3EA] p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#122452] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#B68A35]" />
              <span>{activeCampus.name}</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
              {activeCampus.address}, {activeCampus.city} — {activeCampus.postalCode}
            </p>

            <div className="space-y-2 pt-2 border-t border-[#DFE3EA] text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-[#172033]">
                <Phone className="w-4 h-4 text-[#B68A35] shrink-0" />
                <a href={`tel:${activeCampus.phone}`} className="hover:text-[#B68A35] font-semibold transition-colors">
                  {activeCampus.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[#172033]">
                <Mail className="w-4 h-4 text-[#B68A35] shrink-0" />
                <a href={`mailto:${activeCampus.email}`} className="hover:text-[#B68A35] transition-colors">
                  {activeCampus.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[#596579]">
                <Clock className="w-4 h-4 text-[#B68A35] shrink-0" />
                <span>{activeCampus.hours}</span>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="mt-4 rounded-xl overflow-hidden border border-[#DFE3EA] aspect-[16/10] bg-slate-100 relative">
              <iframe
                title={`${activeCampus.name} Location Map`}
                src={activeCampus.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right: Admission & Contact Enquiry Form (7 columns) */}
      <div className="lg:col-span-7 bg-white rounded-[8px] border border-[#DFE3EA] p-6 sm:p-8 shadow-xs">
        <div className="mb-6 space-y-1">
          <span className="text-xs font-bold text-[#B68A35] capitalize tracking-wide block">
            Admissions Enquiry
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#122452]">
            Send us an enquiry
          </h2>
          <p className="text-xs sm:text-sm text-[#596579]">
            We&apos;re here to help you with program details, eligibility, test series, and batch schedules.
          </p>
        </div>

        {/* Success State Banner */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sm">Thank you! Your enquiry has been received.</p>
              <p className="text-xs text-emerald-800">
                Our admissions coordinator will contact you shortly via phone to guide you through the enrollment process.
              </p>
            </div>
          </div>
        )}

        {/* Server Error Banner */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot field for bot mitigation */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="institutionRef">Leave this field blank</label>
            <input
              type="text"
              id="institutionRef"
              name="institutionRef"
              tabIndex={-1}
              autoComplete="off"
              value={formData.institutionRef}
              onChange={(e) => setFormData({ ...formData, institutionRef: e.target.value })}
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-[#122452] mb-1">
              Parent or Student Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none transition-colors ${
                errors.name ? "border-red-400 focus:border-red-500" : "border-[#DFE3EA] focus:border-[#B68A35]"
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Phone & Email (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-[#122452] mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="e.g. +91 98428 23195"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none transition-colors ${
                  errors.phone ? "border-red-400 focus:border-red-500" : "border-[#DFE3EA] focus:border-[#B68A35]"
                }`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#122452] mb-1">
                Email Address <span className="text-[#596579] font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. student@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none transition-colors ${
                  errors.email ? "border-red-400 focus:border-red-500" : "border-[#DFE3EA] focus:border-[#B68A35]"
                }`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Program & Campus Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="program" className="block text-xs font-semibold text-[#122452] mb-1">
                Program of Interest <span className="text-red-500">*</span>
              </label>
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              >
                <option value="Admissions information">Admissions information</option>
                {programs.map(program => <option key={program.id} value={program.title}>{program.title}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="campus" className="block text-xs font-semibold text-[#122452] mb-1">
                Preferred Campus <span className="text-red-500">*</span>
              </label>
              <select
                id="campus"
                name="campus"
                value={formData.campus}
                onChange={(e) => {
                  const camp = e.target.value as "Puducherry" | "Karaikal";
                  setFormData({ ...formData, campus: camp });
                  setSelectedCampusSlug(camp.toLowerCase());
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              >
                <option value="Puducherry">Puducherry Campus</option>
                <option value="Karaikal">Karaikal Campus</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-[#122452] mb-1">
              Your Message or Questions <span className="text-[#596579] font-normal">(Optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Tell us about the student's current class, school, or specific questions..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
            />
          </div>

          {/* Privacy Policy Checkbox */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                id="privacyConsent"
                name="privacyConsent"
                checked={formData.privacyConsent}
                onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#B68A35] focus:ring-[#B68A35]"
              />
              <span className="text-xs text-[#596579] leading-relaxed">
                I agree to be contacted by {settings.institutionName} regarding program details and admission counselling.
              </span>
            </label>
            {errors.privacyConsent && (
              <p className="text-xs text-red-600 mt-1">{errors.privacyConsent}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting enquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Admission Enquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

