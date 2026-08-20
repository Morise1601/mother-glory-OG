import { GraduationCap, BookOpen, Award, CheckCircle2, Users, Bus, Sparkles } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "NEET & Entrance Coaching",
    category: "Coaching",
    description: "Specialized, result-oriented coaching for NEET, JIPMER, AIIMS, and top competitive medical entrance exams.",
  },
  {
    icon: BookOpen,
    title: "NCERT & Exam Modules",
    category: "Academics",
    description: "Exhaustive NCERT-focused study materials, chapter-wise question banks, and 15+ years solved papers.",
  },
  {
    icon: Award,
    title: "Daily Tests & NEET Mock Exams",
    category: "Assessment",
    description: "Daily Practice Problems (DPP), weekly tests, and full-length simulated NEET exams with error analysis.",
  },
  {
    icon: Users,
    title: "Expert Biology & Science Faculties",
    category: "Mentorship",
    description: "Highly qualified educators providing 1-on-1 doubt resolution, concept clarity, and strategy guidance.",
  },
  {
    icon: CheckCircle2,
    title: "Interactive Smart Classrooms",
    category: "Learning",
    description: "High-definition visual learning tools for complex anatomical models, diagrams, and chemistry mechanisms.",
  },
  {
    icon: Bus,
    title: "Safe & Convenient Transport",
    category: "Campus",
    description: "Dedicated, safe transport network connecting medical aspirants across Karaikal, Puducherry, and nearby areas.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-10 sm:py-16 md:py-24 relative overflow-hidden bg-[#060a12] text-white">
      {/* Background Subtle Mesh Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#122452]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-[#122452] text-white text-xs font-normal uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Academy Features &amp; Ecosystem
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight">
            Designed to <span className="text-white">Inspire &amp; Empower</span> Medical Aspirants
          </h2>
          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed font-normal">
            Our academy provides a complete learning ecosystem with expert faculties, comprehensive test series, and dedicated mentorship for NEET success.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 sm:p-8 rounded-lg bg-slate-900 backdrop-blur-xl border border-slate-800 hover:border-[#122452] transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[#122452]/40"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#122452] text-white flex items-center justify-center font-semibold border border-white/20 group-hover:bg-[#1b3260] transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-normal uppercase tracking-wider text-slate-300 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-slate-950 border border-slate-800">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-sora font-semibold text-white mb-2 sm:mb-3 group-hover:text-slate-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
