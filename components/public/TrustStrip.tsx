import { MapPin, Award, BookCheck, Users, ShieldCheck } from "lucide-react";

export default function TrustStrip() {
  const points = [
    {
      icon: MapPin,
      title: "Puducherry & Karaikal",
      desc: "Two accessible full-time coaching centres",
    },
    {
      icon: Award,
      title: "16+ Years Experience",
      desc: "Guiding NEET aspirants with precision",
    },
    {
      icon: BookCheck,
      title: "NCERT-Aligned Pedagogy",
      desc: "Daily doubt clearance & grand mock test series",
    },
    {
      icon: Users,
      title: "Personal Mentorship",
      desc: "Continuous performance tracking & feedback",
    },
  ];

  return (
    <section className="bg-white border-b border-[#DFE3EA] py-5 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Single Column (grid-cols-1), Tablet: 2 Columns (sm:grid-cols-2), Desktop: 4 Columns (lg:grid-cols-4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 sm:p-2 rounded-[8px] bg-[#FAF8F3]/70 sm:bg-transparent border border-[#DFE3EA]/70 sm:border-0"
              >
                <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-[8px] bg-white sm:bg-[#FAF8F3] border border-[#DFE3EA] flex items-center justify-center shrink-0 shadow-xs sm:shadow-none">
                  <Icon className="w-5 h-5 text-[#B68A35]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#122452] leading-tight">
                    {pt.title}
                  </h4>
                  <p className="text-xs text-[#596579] mt-0.5 leading-snug">
                    {pt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

