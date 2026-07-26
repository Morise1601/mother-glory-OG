import { Heart, Compass, Target, Award, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Proven NEET Coaching",
    description: "Pioneer entrance coaching methodology designed to foster deep analytical problem-solving in Physics, Chemistry, & Biology.",
  },
  {
    icon: Compass,
    title: "Values & Mentorship",
    description: "Instilling moral values, dedication, and personal discipline through structured 1-on-1 student mentorship.",
  },
  {
    icon: Award,
    title: "NEET Test Series & DPPs",
    description: "Daily Practice Problems (DPP), chapter-wise tests, and simulated full-length NEET entrance examinations.",
  },
  {
    icon: Heart,
    title: "Holistic Student Care",
    description: "Nurturing emotional resilience, stress-free learning, constant motivation, and individual doubt-clearing.",
  },
];

const familyReasons = [
  "16+ Years NEET Excellence",
  "3,000+ Eligible NEET Qualifiers",
  "1,000+ Medical College Seats",
  "JIPMER, AIIMS & CMC Selections",
  "Expert Biology & Science Faculty",
  "Daily Mock Tests & Mentorship",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#122452] text-white text-xs font-normal uppercase tracking-wider border border-[#122452]">
            About Mother Glory NEET Academy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold text-[#122452] dark:text-white tracking-tight">
            Pioneering Medical Entrance <span className="text-[#122452] dark:text-blue-300">Coaching Excellence</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Mother Glory NEET Academy is the best and leading institute in Puducherry &amp; Karaikal. We are the pioneer institution training students to face all competitive entrance exams. In 16 years, 3,000+ students cleared eligibility marks and 1,000+ students secured medical courses in leading institutions like JIPMER, AIIMS, and CMC.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-[#122452]/15 dark:border-slate-800 hover:border-[#122452] transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl hover:shadow-[#122452]/15"
              >
                <div className="w-14 h-14 rounded-lg bg-[#122452] text-white flex items-center justify-center font-semibold mb-6 shadow-md shadow-[#122452]/25 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-sora font-semibold text-[#122452] dark:text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Why Families Choose Mother Glory Highlights Card - Fixed High Contrast #122452 Background */}
        <div className="rounded-lg p-8 sm:p-12 bg-[#122452] text-white shadow-2xl border border-[#122452] relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-sora font-semibold text-white">
                Why Aspirants Choose Mother Glory
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                With God&apos;s grace and glorious Mother Mary&apos;s blessings, we combine moral values with result-oriented coaching, guiding medical aspirants from foundational concepts to top rank achievements.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {familyReasons.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-sm font-normal text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
