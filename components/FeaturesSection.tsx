import { Cpu, Library, Trophy, Music, Shield, Bus, Sparkles } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Robotics & Innovation Lab",
    category: "STEM",
    description: "Hands-on experience with 3D printers, microcontrollers, and artificial intelligence workshops.",
  },
  {
    icon: Library,
    title: "Digital & Physical Library",
    category: "Academics",
    description: "Over 25,000 physical volumes and 24/7 access to international research journals.",
  },
  {
    icon: Trophy,
    title: "Multi-Sport Complex",
    category: "Athletics",
    description: "Olympic-standard basketball courts, swimming pool, badminton arenas, and trained coaches.",
  },
  {
    icon: Music,
    title: "Performing Arts Theatre",
    category: "Arts",
    description: "Acoustically tuned 600-seater auditorium for drama, musical concerts, and cultural galas.",
  },
  {
    icon: Bus,
    title: "GPS-Tracked Safe Transport",
    category: "Safety",
    description: "Fleet of air-conditioned buses equipped with real-time GPS tracking and dedicated attendants.",
  },
  {
    icon: Shield,
    title: "Eco-Friendly Smart Campus",
    category: "Infrastructure",
    description: "Solar-powered energy systems, lush green botanical gardens, and zero-plastic dining spaces.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#060a12] text-white">
      {/* Background Subtle Mesh Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#122452]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#122452] text-white text-xs font-normal uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            World-Class Facilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight">
            Designed to <span className="text-white">Inspire & Empower</span> Every Student
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Our campus is thoughtfully constructed to provide an immersive environment for learning, creation, health, and holistic personal growth.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-lg bg-slate-900 backdrop-blur-xl border border-slate-800 hover:border-[#122452] transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-[#122452]/40"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#122452] text-white flex items-center justify-center font-semibold border border-white/20 group-hover:bg-[#1b3260] transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-normal uppercase tracking-wider text-slate-300 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xl font-sora font-semibold text-white mb-3 group-hover:text-slate-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
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
