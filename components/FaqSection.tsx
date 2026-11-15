"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    question: "Why is Mother Glory Coaching Centre considered the best NEET coaching in Karaikal and Puducherry?",
    answer:
      "Mother Glory Coaching & Tutorial Centre has a proven 16+ year track record of excellence. With over 3,000+ students clearing NEET eligibility marks and 1,000+ securing seats in top medical colleges like JIPMER, AIIMS, and CMC, our expert faculty, daily practice problems (DPPs), simulated mock tests, and 1-on-1 mentorship deliver unparalleled results.",
    category: "Coaching & Results",
  },
  {
    question: "What courses are offered at Mother Glory Coaching Centre?",
    answer:
      "We offer comprehensive NEET UG Coaching, Foundation Courses for Class 9 & 10 students, Board Exam & Competitive Entrance Preparation for Class 11 & 12, as well as dedicated Repeater / Dropper NEET batches with full-length test series.",
    category: "Courses",
  },
  {
    question: "Where are Mother Glory Coaching Centre campuses located?",
    answer:
      "We operate state-of-the-art campuses in both Puducherry (11, 1st Cross, Subaiya Nagar, Sanjay Gandhi Nagar, Pudupalaiyam) and Karaikal (171, Church Street). Both campuses feature modern classrooms, library facilities, and safe transport options.",
    category: "Campuses",
  },
  {
    question: "Does Mother Glory provide Daily Practice Problems (DPP) and NEET Mock Tests?",
    answer:
      "Yes, all students receive daily practice problem sets, chapter-wise test papers, NCERT-focused study modules, and simulated full-length NEET mock exams with detailed error analysis to build speed, accuracy, and examination confidence.",
    category: "Academic Support",
  },
  {
    question: "How can parents and medical aspirants enroll or get in touch for admissions?",
    answer:
      "You can reach our admission helplines at +91 98428 23195 or +91 98944 23195, email admissions@motherglory.edu, or visit either our Puducherry or Karaikal campus for direct counselling.",
    category: "Admissions",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-10 sm:py-16 md:py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-red-600 text-white text-sm font-semibold uppercase tracking-wider border border-amber-400/40 shadow-md">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight text-[#122452] dark:text-white">
            Everything You Need to Know <span className="text-[#122452] dark:text-blue-300">About Mother Glory</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Find quick answers regarding our NEET entrance coaching, courses, campus facilities in Karaikal &amp; Puducherry, and admissions process.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-[#122452]/20 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-sora font-semibold text-sm sm:text-base text-[#122452] dark:text-white focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 leading-snug">{faq.question}</span>
                  <div
                    className={`p-1.5 rounded-lg shrink-0 transition-all duration-300 ${isOpen
                        ? "rotate-180 bg-[#122452] text-white dark:bg-sky-500 dark:text-white shadow-sm"
                        : "bg-[#122452]/10 text-[#122452] dark:bg-slate-800 dark:text-slate-200"
                      }`}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-current stroke-[2.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-slate-700 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-200">
                    <p className="font-normal">{faq.answer}</p>
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
