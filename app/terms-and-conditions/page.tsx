import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2, Clock, HelpCircle, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Mother Glory Institutions",
  description:
    "Review the official Terms and Conditions governing academic programs, campus conduct, digital services, and enrollment policies at Mother Glory.",
  keywords: [
    "Mother Glory Terms and Conditions",
    "School Terms of Service",
    "Academic Policies",
    "Mother Glory Legal",
    "Student Code of Conduct",
  ],
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms and Conditions | Mother Glory Institutions",
    description:
      "Official Terms and Conditions for Mother Glory Educational Institution.",
    url: "https://motherglory.edu/terms-and-conditions",
    siteName: "Mother Glory",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Mother Glory Institutions",
    description: "Official legal terms and academic policies for Mother Glory.",
  },
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "July 25, 2026";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://motherglory.edu",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms and Conditions",
        item: "https://motherglory.edu/terms-and-conditions",
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms and Conditions",
    description:
      "Terms and conditions for Mother Glory Educational Institution.",
    url: "https://motherglory.edu/terms-and-conditions",
    dateModified: "2026-07-25",
    publisher: {
      "@type": "EducationalOrganization",
      name: "Mother Glory",
      url: "https://motherglory.edu",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-[#122452]/30 selection:text-amber-400">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* Header Navigation */}
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            <li>
              <Link href="/" className="hover:text-[#122452] dark:hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#122452] dark:text-white font-medium" aria-current="page">
              Terms and Conditions
            </li>
          </ol>
        </nav>

        {/* Page Header Banner - Matches Homepage Deep Navy Branding Card */}
        <header className="rounded-lg p-8 sm:p-12 bg-[#122452] text-white shadow-2xl border border-[#122452] relative overflow-hidden mb-12">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-white/10 text-white text-xs font-normal uppercase tracking-wider border border-white/20">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Legal Governance &amp; Institutional Policy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold text-white tracking-tight leading-tight">
              Terms &amp; Conditions
            </h1>

            <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              These Terms and Conditions govern your access to Mother Glory&apos;s educational programs, campus facilities, digital portals, and official admission channels.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-white" />
                Last Updated: {lastUpdated}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-300" />
                Official Campus Policy
              </span>
            </div>
          </div>
        </header>

        {/* Legal Document Content */}
        <article className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Quick Table of Contents Sticky Bar */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-28 space-y-3 bg-white dark:bg-slate-900 p-5 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md">
              <h3 className="text-xs font-sora font-semibold text-[#122452] dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#122452] dark:text-blue-300" />
                On This Page
              </h3>
              <nav aria-label="Table of contents">
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-normal">
                  <li>
                    <a href="#acceptance" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      1. Acceptance of Terms
                    </a>
                  </li>
                  <li>
                    <a href="#code-of-conduct" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      2. Code of Conduct
                    </a>
                  </li>
                  <li>
                    <a href="#admissions" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      3. Admission &amp; Fees
                    </a>
                  </li>
                  <li>
                    <a href="#intellectual-property" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      4. Intellectual Property
                    </a>
                  </li>
                  <li>
                    <a href="#digital-portals" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      5. Digital Usage &amp; Portals
                    </a>
                  </li>
                  <li>
                    <a href="#liability" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      6. Limitation of Liability
                    </a>
                  </li>
                  <li>
                    <a href="#governance" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      7. Governance &amp; Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Detailed Legal Sections */}
          <div className="lg:col-span-3 space-y-8 text-slate-600 dark:text-slate-300 font-normal text-sm sm:text-base leading-relaxed">

            {/* Section 1 */}
            <section
              id="acceptance"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  01
                </span>
                Acceptance of Terms
              </h2>
              <p>
                By enrolling in Mother Glory Educational Institution, accessing our official portal, or participating in campus activities, parents, legal guardians, students, and visitors agree to be bound by these Terms and Conditions.
              </p>
              <p>
                If you do not agree with any portion of these terms, please consult our administrative compliance team prior to completing admission forms or submitting registration agreements.
              </p>
            </section>

            {/* Section 2 */}
            <section
              id="code-of-conduct"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  02
                </span>
                Campus Code of Conduct
              </h2>
              <p>
                Mother Glory maintains a strict policy regarding respectful, inclusive, and safe learning environments.
              </p>
              <ul className="space-y-2.5 pl-5 list-disc text-slate-600 dark:text-slate-300">
                <li>Zero tolerance for bullying, harassment, academic dishonesty, or discrimination in any form.</li>
                <li>Care and respect for institutional facilities, STEM &amp; Robotics equipment, and library resources.</li>
                <li>Compliance with safety protocols during athletic events, lab experiments, and school transportation.</li>
                <li>Responsible digital citizenship on all school network connections and learning management systems.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section
              id="admissions"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  03
                </span>
                Admission, Tuition &amp; Fee Policies
              </h2>
              <p>
                All student admissions are subject to availability, eligibility verification, and academic evaluation standards.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-[#122452]/15 dark:border-slate-700 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#122452] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Tuition schedules must be satisfied according to specified payment timelines.</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#122452] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Late payments may incur administrative charges or temporary restriction from non-mandatory activities.</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#122452] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Refund policies apply strictly according to the official Mother Glory Admissions Refund Guideline.</span>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section
              id="intellectual-property"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  04
                </span>
                Intellectual Property Rights
              </h2>
              <p>
                All content published on the Mother Glory portal—including curriculum modules, logos, branding assets, images, text, software, and video materials—is the exclusive property of Mother Glory Educational Institution.
              </p>
              <p>
                Unauthorized reproduction, distribution, or commercial exploitation of institutional materials without prior written consent is strictly prohibited.
              </p>
            </section>

            {/* Section 5 */}
            <section
              id="digital-portals"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  05
                </span>
                Digital Portals &amp; System Usage
              </h2>
              <p>
                Users are granted a limited, non-transferable license to access digital resources and parent/student portals solely for academic and communication purposes.
              </p>
              <p>
                You agree not to attempt unauthorized access to school servers, alter records, or bypass security features.
              </p>
            </section>

            {/* Section 6 */}
            <section
              id="liability"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  06
                </span>
                Limitation of Liability
              </h2>
              <p>
                While Mother Glory exercises high standards of care, the institution is not liable for indirect, incidental, or consequential damages resulting from unexpected technical outages or third-party service interruptions.
              </p>
            </section>

            {/* Section 7 */}
            <section
              id="governance"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  07
                </span>
                Governing Law &amp; Contact Information
              </h2>
              <p>
                These terms are governed by the educational regulations and laws of the jurisdiction in which Mother Glory operates.
              </p>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-sora font-semibold text-[#122452] dark:text-white uppercase">Questions regarding legal terms?</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reach out to our administrative compliance team.</p>
                </div>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#122452] hover:bg-[#1b3260] rounded-lg shadow-md transition-all border border-white/20"
                >
                  <HelpCircle className="w-4 h-4 text-white" />
                  <span>Contact Administration</span>
                </Link>
              </div>
            </section>

          </div>
        </article>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}
