import { BookOpen, Target, BarChart3, Users2, ArrowRight } from "lucide-react";

export default function LearningApproach() {
  const steps = [
    {
      num: "1",
      icon: BookOpen,
      title: "Concept Clarity",
      desc: "Strong foundation through simple, rigorous and precise teaching of core Physics, Chemistry, and Biology principles.",
    },
    {
      num: "2",
      icon: Target,
      title: "Practice with Purpose",
      desc: "Topic-wise practice problem sets (DPPs) and regular timed assessments to build numerical speed and accuracy.",
    },
    {
      num: "3",
      icon: BarChart3,
      title: "Performance Analysis",
      desc: "Identify strengths and work on improvement areas continuously using comprehensive test diagnostics and error logs.",
    },
    {
      num: "4",
      icon: Users2,
      title: "Ongoing Mentorship",
      desc: "Personal faculty guidance, dedicated daily doubt clearing, and continuous motivation at every step of the journey.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-[#DFE3EA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#B68A35] tracking-wide capitalize block">
            The Mother Glory Methodology
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
            Our learning approach
          </h2>
          <p className="text-xs sm:text-sm text-[#596579]">
            A structured journey from fundamentals to confident examination performance.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#FAF8F3] rounded-[8px] border border-[#DFE3EA] p-6 relative flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="space-y-4">
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-full bg-[#122452] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-[#B68A35] group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#122452]">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#596579] mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

