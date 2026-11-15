import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = {
  alternates: { canonical: "/privacy-policy" },
  openGraph: { url: "/privacy-policy" },
  title: "Privacy Policy | Mother Glory Coaching & Tutorial Centre",
  description: "Privacy policy and personal data protection procedures for Mother Glory Coaching & Tutorial Centre.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-3">
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#122452]">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#596579]">
              Last updated: October 2026 • Mother Glory Coaching & Tutorial Centre
            </p>
          </div>

          <article className="prose prose-slate max-w-none text-xs sm:text-sm text-[#172033] space-y-6 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">1. Introduction</h2>
              <p>
                Mother Glory Coaching & Tutorial Centre (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Institution&rdquo;) operates coaching centres in Puducherry and Karaikal. We respect the privacy of students, parents, and website visitors, and are committed to safeguarding personal information collected through our website and admissions enquiry forms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">2. Information We Collect</h2>
              <p>
                When you submit an admission enquiry or contact request, we collect information necessary to counsel and register the student:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Student or Parent full name</li>
                <li>Contact telephone/mobile number</li>
                <li>Email address (optional)</li>
                <li>Academic program of interest (e.g. NEET UG, Repeaters, Foundation)</li>
                <li>Preferred coaching centre branch (Puducherry or Karaikal)</li>
                <li>Information provided in your enquiry message</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">3. Purpose of Processing</h2>
              <p>
                The collected information is utilized strictly for institutional educational purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contacting you by telephone or email to discuss program admissions, eligibility, and batch schedules.</li>
                <li>Answering specific questions regarding syllabus, test series, and study materials.</li>
                <li>Internal administrative management, audit logging, and anti-spam verification.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">4. Third-Party Integrations & Google Services</h2>
              <p>
                Our website utilizes the official Google Places API (New) to display verified ratings and publicly posted reviews from our Google Business Profile. Google Maps embeds are provided for campus directions. Use of these features is governed by Google&apos;s Privacy Policy. We do not transmit your student enquiry details to Google or any unauthorized advertising networks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">5. Data Retention & Security</h2>
              <p>
                We employ role-based access control (RLS), encrypted transmissions (HTTPS), and secure authentication. Personal enquiry records are accessible solely by authorized administrative counsellors. You may request deletion or correction of your contact records at any time by writing to admissions@motherglory.edu.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">6. Contact Office</h2>
              <p>
                For privacy inquiries or data requests, contact our administrative office at:
                <br />
                <strong>Mother Glory Coaching & Tutorial Centre</strong>
                <br />
                11, 1st Cross, Subaiya Nagar, Sanjay Gandhi Nagar, Pudupalaiyam, Puducherry — 605 001.
                <br />
                Phone: +91 98428 23195 | Email: admissions@motherglory.edu
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
