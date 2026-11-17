"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection({ customFaqs }: { customFaqs?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FaqItem[] = [
    {
      q: "What programs are available at Mother Glory NEET Academy?",
      a: "We offer comprehensive classroom preparation for NEET UG (Class 11 & 12 appearing students), an intensive full-time Repeaters / Dropper batch, and a Pre-Medical Foundation program for Class 9 and 10 students at both our Puducherry and Karaikal campuses.",
    },
    {
      q: "How does Mother Glory support dropper / repeater students?",
      a: "Our Repeater Batch is a rigorous 1-year full-time curriculum with daily lectures, Daily Practice Problems (DPPs), chapter-wise testing, error analysis logs, and dedicated individual faculty doubt resolution cabins to eliminate negative marking and maximize examination scores.",
    },
    {
      q: "Are the faculty members experienced in medical entrance coaching?",
      a: "Yes. Our instructional team brings over a decade and a half of specialized NEET coaching expertise, led by Academic Director M. Antoine@Prabhu and senior faculty in Physics, Chemistry, Botany, and Zoology.",
    },
    {
      q: "Where are the centres located and what are the office hours?",
      a: "Our Puducherry centre is located at 11, 1st Cross, Subaiya Nagar, Sanjay Gandhi Nagar, Pudupalaiyam, Puducherry 605013. Our Karaikal centre is at 171, Church St, Karaikal, Puducherry 609602. Both centres operate Monday through Saturday from 8:00 AM to 5:00 PM IST.",
    },
    {
      q: "How can parents track their child's academic progress?",
      a: "We conduct weekly OMR-evaluated unit tests and monthly simulated grand mock examinations. Detailed performance diagnostic reports and regular parent-teacher consultations keep families updated on student accuracy, speed, and syllabus mastery.",
    },
  ];

  const faqs = customFaqs && customFaqs.length > 0 ? customFaqs : defaultFaqs;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-[#DFE3EA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold text-[#B68A35] tracking-wide capitalize block">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
            Frequently asked questions
          </h2>
          <p className="text-xs sm:text-sm text-[#596579]">
            Clear answers about our courses, admission procedures, and coaching methodology.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F3] rounded-[8px] border border-[#DFE3EA] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-serif font-semibold text-base sm:text-lg text-[#122452] pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#B68A35] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#596579] leading-relaxed border-t border-[#DFE3EA]/50 pt-3"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

