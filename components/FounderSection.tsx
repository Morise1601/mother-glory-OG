import Image from "next/image";
import { Quote, Award, Sparkles, HeartHandshake, BookOpen } from "lucide-react";

export default function FounderSection() {
  return (
    <section id="founder" className="py-24 relative overflow-hidden bg-[#060a12] text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#122452] rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Badge */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#122452] text-white text-xs font-normal uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Leadership & Heritage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight">
            The Vision Behind <span className="text-white">Mother Glory</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Meet our founder whose dedication to academic perfection and moral values laid the cornerstone of our institution.
          </p>
        </div>

        {/* Main Founder Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Founder Photo Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Outer Card Frame with #122452 border */}
              <div className="relative rounded-lg overflow-hidden glass-panel p-3 shadow-2xl border-2 border-[#122452] bg-slate-900">
                <div className="relative h-[420px] sm:h-[500px] w-full rounded-lg overflow-hidden">
                  <Image
                    src="/images/founder.png"
                    alt="Founder of Mother Glory"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-transparent opacity-90" />

                  {/* Name Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="px-3.5 py-1 rounded-lg bg-[#122452] text-white text-xs font-normal border border-white/20">
                      Founder & Chairman
                    </span>
                    <h3 className="text-2xl font-sora font-semibold pt-2">Dr. Arthur H. Glory</h3>
                    <p className="text-xs text-slate-200 font-normal">Visionary Educator & Philanthropist</p>
                  </div>
                </div>
              </div>

              {/* Floating Award Badge */}
              <div className="absolute -bottom-6 -right-4 hidden sm:flex items-center gap-3 p-4 rounded-lg bg-[#122452] text-white border border-white/20 shadow-2xl animate-float">
                <div className="p-3 rounded-lg bg-white text-[#122452] font-semibold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">National Awardee</p>
                  <p className="text-xs text-slate-200 font-normal">Excellence in Leadership</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Founder's Message & Core Beliefs */}
          <div className="lg:col-span-7 space-y-8">

            {/* Quote Block */}
            <div className="relative p-8 sm:p-10 rounded-lg bg-[#122452] border border-white/20 shadow-2xl space-y-4">
              <Quote className="w-10 h-10 text-white opacity-80" />
              <p className="text-lg sm:text-xl text-white font-normal leading-relaxed italic">
                "Education is not merely about accumulating knowledge; it is the ignition of wisdom, integrity, and courage to transform society. At Mother Glory, every child is nurtured to lead with compassion and excel with purpose."
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-white/20">
                <span className="text-sm font-semibold text-white">— Dr. Arthur H. Glory</span>
                <span className="text-xs text-slate-300 font-mono">Founding Message</span>
              </div>
            </div>

            {/* Key Pillars of Leadership */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-sora font-semibold text-base">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span>16+ Years Legacy</span>
                </div>
                <p className="text-sm text-slate-300 font-normal">
                  Over two decades of pioneering educational innovations and building world-class learning infrastructure.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-sora font-semibold text-base">
                  <HeartHandshake className="w-5 h-5 text-white" />
                  <span>Student Centric Philosophy</span>
                </div>
                <p className="text-sm text-slate-300 font-normal">
                  Championing inclusive learning where every student receives personalized mentorship and guidance.
                </p>
              </div>

            </div>

            {/* Impact Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-sora font-semibold text-white">16+</p>
                <p className="text-xs text-slate-400 font-normal">Years of Service</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-sora font-semibold text-white">1,000+</p>
                <p className="text-xs text-slate-400 font-normal">Doctors</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-sora font-semibold text-white">150+</p>
                <p className="text-xs text-slate-400 font-normal">Jipmer Seats</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
