import Image from "next/image";
import { Sparkles, ShieldCheck, Award, ArrowRight, Play, GraduationCap, Star } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative pt-20 pb-10 sm:pt-32 sm:pb-16 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-[#122452]/10 via-transparent to-transparent dark:from-[#122452]/30"
    >
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-[#122452]/15 dark:bg-[#122452]/25 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 items-center">

          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg glass-panel border border-[#122452]/30 text-[#122452] dark:text-white text-xs sm:text-sm font-normal shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#122452] dark:text-white animate-spin" style={{ animationDuration: '4s' }} />
              <span>Admissions Open 2026 - 2027</span>
              <span className="w-2 h-2 rounded-lg bg-[#122452] animate-ping" />
            </div>

            {/* Main Title - Single H1 for top SEO ranking */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sora font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Empowering Minds, <br className="hidden sm:inline" />
              <span className="text-[#122452] dark:text-blue-200">
                Inspiring Excellence
              </span>{" "}
              & Shaping Futures
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-lg lg:text-xl text-slate-700 dark:text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              At <strong className="text-[#122452] font-semibold">Mother Glory Coaching &amp; Tutorial Centre</strong>, we have been shaping future doctors for over 16 years through expert NEET coaching in Karaikal &amp; Puducherry, result-oriented teaching methodologies, and personalized mentoring.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <a
                href="#gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-white bg-[#122452] hover:bg-[#1b3260] rounded-lg shadow-lg shadow-[#122452]/30 hover:shadow-xl transition-all border border-white/20"
              >
                <span>Explore Gallery Slider</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>

              <a
                href="#founder"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-4 text-sm sm:text-base font-medium text-[#122452] dark:text-white glass-panel hover:bg-[#122452] hover:text-white dark:hover:bg-slate-800 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-[#122452]" />
                <span className="group-hover:text-[#122452]">Founder&apos;s Vision</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <div className="space-y-0.5">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#122452] dark:text-white">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#122452] dark:fill-white" />
                  <span className="font-semibold text-xs sm:text-base text-slate-900 dark:text-white">4.9 / 5</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Parent Satisfaction</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#122452] dark:text-white">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-semibold text-xs sm:text-base text-slate-900 dark:text-white">100%</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Pass Rate</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#122452] dark:text-white">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-semibold text-xs sm:text-base text-slate-900 dark:text-white">3,000+</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">NEET Qualifiers</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Main Feature Banner Card */}
              <div className="relative rounded-lg overflow-hidden glass-panel p-2 sm:p-3 shadow-xl border-2 border-[#122452] group">
                <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden">
                  <Image
                    src="/images/hero_banner_mg.png"
                    alt="Mother Glory NEET Coaching Academy Karaikal Puducherry"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-transparent opacity-90" />

                  {/* Floating Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#122452] text-white text-[10px] sm:text-xs font-normal uppercase tracking-wider border border-white/20">
                      <ShieldCheck className="w-3 h-3 text-white" /> Pioneer NEET Academy
                    </div>
                    <h3 className="text-base sm:text-xl font-sora font-semibold">16+ Years of Medical Excellence</h3>
                    <p className="text-[11px] sm:text-xs text-slate-200">1,000+ seats secured in JIPMER, AIIMS &amp; CMC</p>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge 1 */}
              <div className="absolute -top-4 -left-4 hidden sm:flex items-center gap-3 p-3.5 rounded-lg bg-[#122452] text-white shadow-xl border border-white/20 animate-float">
                <div className="p-2.5 rounded-lg bg-white text-[#122452] font-semibold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-normal text-slate-200">Leading Institute</p>
                  <p className="text-xs font-semibold text-white">NEET Coaching</p>
                </div>
              </div>

              {/* Floating Stat Badge 2 */}
              <div className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-3 p-3.5 rounded-lg bg-[#122452] text-white shadow-xl border border-white/20">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-white text-[#122452] border-2 border-[#122452] flex items-center justify-center text-xs font-semibold">M</div>
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-[#122452] border-2 border-[#122452] flex items-center justify-center text-xs font-semibold">G</div>
                  <div className="w-7 h-7 rounded-lg bg-[#1b3260] text-white border-2 border-white flex items-center justify-center text-xs font-semibold">A</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Puducherry &amp; Karaikal</p>
                  <p className="text-[10px] text-slate-300">Pioneer Entrance Academy</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
