import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, ArrowLeft, Lock, CheckCircle2, Clock, Eye, Mail, FileKey } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Mother Glory Institutions",
  description:
    "Learn how Mother Glory Institutions collects, protects, uses, and safeguards personal data for students, parents, and website visitors.",
  keywords: [
    "Mother Glory Privacy Policy",
    "Student Data Protection",
    "Educational Privacy Policy",
    "COPPA FERPA Compliance",
    "Data Security",
  ],
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Mother Glory Institutions",
    description:
      "Learn how Mother Glory safeguards student, parent, and institutional data privacy.",
    url: "https://motherglory.edu/privacy-policy",
    siteName: "Mother Glory",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Mother Glory Institutions",
    description: "Official Privacy Policy and Data Security Commitment for Mother Glory.",
  },
};

export default function PrivacyPolicyPage() {
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
        name: "Privacy Policy",
        item: "https://motherglory.edu/privacy-policy",
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "Privacy Policy for Mother Glory Educational Institution.",
    url: "https://motherglory.edu/privacy-policy",
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
              Privacy Policy
            </li>
          </ol>
        </nav>

        {/* Page Header Banner - Matches Homepage Deep Navy Branding Card */}
        <header className="rounded-lg p-8 sm:p-12 bg-[#122452] text-white shadow-2xl border border-[#122452] relative overflow-hidden mb-12">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-white/10 text-white text-xs font-normal uppercase tracking-wider border border-white/20">
              <Lock className="w-4 h-4 text-white" />
              <span>Data Protection &amp; Student Confidentiality</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold text-white tracking-tight leading-tight">
              Privacy Policy
            </h1>

            <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Mother Glory is dedicated to protecting student, parent, and institutional data with the highest standards of digital privacy and transparency.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-white" />
                Last Updated: {lastUpdated}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FileKey className="w-3.5 h-3.5 text-emerald-300" />
                FERPA &amp; COPPA Aligned Standards
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
                <Eye className="w-4 h-4 text-[#122452] dark:text-blue-300" />
                Policy Sections
              </h3>
              <nav aria-label="Table of contents">
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-normal">
                  <li>
                    <a href="#information-collection" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      1. Information We Collect
                    </a>
                  </li>
                  <li>
                    <a href="#how-we-use-data" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      2. How Data is Used
                    </a>
                  </li>
                  <li>
                    <a href="#student-privacy" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      3. Student Data Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#cookies-analytics" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      4. Cookies &amp; Tracking
                    </a>
                  </li>
                  <li>
                    <a href="#data-sharing" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      5. Information Sharing
                    </a>
                  </li>
                  <li>
                    <a href="#data-security" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      6. Security Safeguards
                    </a>
                  </li>
                  <li>
                    <a href="#your-rights" className="hover:text-[#122452] dark:hover:text-white transition-colors block py-1">
                      7. Parent Rights &amp; Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Detailed Privacy Sections */}
          <div className="lg:col-span-3 space-y-8 text-slate-600 dark:text-slate-300 font-normal text-sm sm:text-base leading-relaxed">

            {/* Section 1 */}
            <section
              id="information-collection"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  01
                </span>
                Information We Collect
              </h2>
              <p>
                We collect personal information necessary for academic administration, admissions inquiries, and portal interaction.
              </p>
              <ul className="space-y-2.5 pl-5 list-disc text-slate-600 dark:text-slate-300">
                <li><strong>Contact Details:</strong> Names, email addresses, telephone numbers, and physical mailing addresses provided during inquiry or application forms.</li>
                <li><strong>Academic Records:</strong> Enrollment status, grade level, attendance, and evaluation metrics required for educational delivery.</li>
                <li><strong>Technical Diagnostics:</strong> IP addresses, browser types, device identifiers, and page visit duration collected automatically to maintain website stability.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section
              id="how-we-use-data"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  02
                </span>
                How We Use Your Data
              </h2>
              <p>
                Data collected by Mother Glory is strictly utilized to advance our core educational mission and provide efficient communication with families.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-[#122452]/15 dark:border-slate-700 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#122452] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Processing admissions applications and scheduling campus tours.</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#122452] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Delivering newsletters, emergency notices, and academic progress updates.</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#122452] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Enhancing digital infrastructure, cybersecurity, and portal usability.</span>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section
              id="student-privacy"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  03
                </span>
                Student Data Privacy Protection
              </h2>
              <p>
                Mother Glory adheres to strict student privacy regulations. We never monetize, sell, or rent student personal information or academic profiles to advertisers or third-party brokers.
              </p>
              <p>
                Minor student records are protected with strict access controls available only to authorized educational staff and verified parents or legal guardians.
              </p>
            </section>

            {/* Section 4 */}
            <section
              id="cookies-analytics"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  04
                </span>
                Cookies &amp; Analytics Technologies
              </h2>
              <p>
                Our website utilizes essential session cookies and performance telemetry to guarantee fast page loads, secure login sessions, and reliable navigation.
              </p>
              <p>
                You can manage cookie preferences directly through your web browser settings at any time without restricting access to core public content.
              </p>
            </section>

            {/* Section 5 */}
            <section
              id="data-sharing"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  05
                </span>
                Third-Party Service Providers
              </h2>
              <p>
                We collaborate with vetted educational platform vendors (such as cloud portal hosting, payment processing, and SMS alert systems) bound by non-disclosure agreements and strict data processing contracts.
              </p>
            </section>

            {/* Section 6 */}
            <section
              id="data-security"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  06
                </span>
                Cybersecurity &amp; Safeguards
              </h2>
              <p>
                Mother Glory employs enterprise-grade encryption (TLS/HTTPS), firewalls, role-based access management, and routine security audits to protect data integrity against unauthorized access or breaches.
              </p>
            </section>

            {/* Section 7 */}
            <section
              id="your-rights"
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-[#122452]/15 dark:border-slate-800 shadow-md space-y-4 transition-all duration-300 hover:border-[#122452]"
            >
              <h2 className="text-xl sm:text-2xl font-sora font-semibold text-[#122452] dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#122452] text-white flex items-center justify-center text-xs font-mono font-semibold">
                  07
                </span>
                Parent Rights &amp; Privacy Inquiries
              </h2>
              <p>
                Parents and legal guardians reserve the right to review their child&apos;s personal records, request data corrections, or opt-out of optional media releases.
              </p>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-sora font-semibold text-[#122452] dark:text-white uppercase">Data Protection Office</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Email: privacy@motherglory.edu</p>
                </div>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#122452] hover:bg-[#1b3260] rounded-lg shadow-md transition-all border border-white/20"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span>Submit Privacy Request</span>
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
