import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = {
  alternates: { canonical: "/terms-and-conditions" },
  openGraph: { url: "/terms-and-conditions" },
  title: "Terms and Conditions | Mother Glory Coaching & Tutorial Centre",
  description: "Terms and conditions governing the use of the Mother Glory Coaching & Tutorial Centre website.",
};

export default async function TermsAndConditionsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-3">
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#122452]">
              Terms & Conditions
            </h1>
            <p className="text-xs text-[#596579]">
              Last updated: October 2026 • Mother Glory Coaching & Tutorial Centre
            </p>
          </div>

          <article className="prose prose-slate max-w-none text-xs sm:text-sm text-[#172033] space-y-6 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">1. Acceptance of Terms</h2>
              <p>
                By accessing or browsing this website (motherglory.com), you acknowledge and accept these terms of use. If you do not agree, please discontinue use of this website.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">2. Educational Guidance & No Admission Guarantee</h2>
              <p>
                Mother Glory Coaching & Tutorial Centre provides tutorial guidance, study materials, and examination preparatory test series for competitive medical entrance examinations (NEET UG). While our instructional programs are designed to optimize academic capability, participation in any program does not constitute an explicit or implied guarantee of qualifying marks, ranks, or medical college admission.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">3. Intellectual Property</h2>
              <p>
                All institutional logos, seal artwork, study materials, mock question sets, achievement posters, photographs, and written content published on this website are the proprietary property of Mother Glory Coaching & Tutorial Centre. Unauthorized reproduction, distribution, or commercial exploitation is prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">4. Accuracy of Information</h2>
              <p>
                We strive to keep program descriptions, course eligibility, and campus details accurate. Batch schedules, faculty rosters, and fee structures are subject to institutional confirmation at the time of formal admission.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#122452]">5. Governing Jurisdiction</h2>
              <p>
                These terms are governed by and construed in accordance with the laws applicable in the Union Territory of Puducherry, India. Any disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the competent courts in Puducherry.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
