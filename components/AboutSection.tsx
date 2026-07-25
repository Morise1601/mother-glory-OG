import { Heart, Compass, Target, Lightbulb, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Academic Rigor",
    description: "Inquiry-based curriculum designed to foster deep analytical thinking and creative problem-solving.",
  },
  {
    icon: Compass,
    title: "Character & Values",
    description: "Instilling integrity, empathy, and social responsibility through structured leadership programs.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & STEM",
    description: "Hands-on robotics, coding, and scientific research labs equipped with cutting-edge tools.",
  },
  {
    icon: Heart,
    title: "Holistic Wellbeing",
    description: "Nurturing physical health, emotional resilience, mindfulness, and creative artistic expression.",
  },
];

const familyReasons = [
  "1:15 Teacher-Student Ratio",
  "100% Smart Classrooms",
  "Global Exchange Programs",
  "Advanced STEM & AI Modules",
  "State-of-the-Art Sports Arena",
  "24/7 Campus Security & Care",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#122452] text-white text-xs font-normal uppercase tracking-wider border border-[#122452]">
            About Mother Glory
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold text-[#122452] dark:text-white tracking-tight">
            Where Visionary Learning Meets <span className="text-[#122452] dark:text-blue-300">Unwavering Glory</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Founded with the commitment to provide transformative education, Mother Glory creates an environment where every student discovers their innate potential and shines brightly in an ever-evolving world.
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
              <span className="px-3.5 py-1 rounded-lg bg-white/10 text-white text-xs font-normal uppercase tracking-wider border border-white/20">
                Core Distinction
              </span>
              <h3 className="text-2xl sm:text-3xl font-sora font-semibold text-white">
                Why Families Choose Mother Glory
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                We combine traditional moral foundations with forward-thinking educational techniques, ensuring a seamless journey from foundational learning to advanced pre-university readiness.
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
