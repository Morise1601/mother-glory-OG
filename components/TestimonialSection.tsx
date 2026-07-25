import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ummal Bajiriya",
    role: "",
    content: "Excellent coaching center of karaikal.Best teaching staff , book materials, model question paper availables....",
    rating: 4,
  },
  {
    name: "Janaranjani",
    role: "",
    content: "I'm Neet aspirant from mother glory Karaikal, Here coaching gives efficient learning and giving hopes to crack Neet.",
    rating: 5,
  },
  {
    name: "Simi",
    role: "",
    content: "I’m a NEET aspirant from Mother Glory Karaikal, Classes were amazing. Feeling confident about cracking NEET.",
    rating: 5,
  },
];

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-50/60 dark:bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#122452] text-white text-xs font-normal uppercase tracking-wider border border-[#122452]">
            Voices of Trust
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold text-[#122452] dark:text-white tracking-tight">
            What Parents & Alumni <span className="text-[#122452] dark:text-blue-300">Say About Us</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Discover real experiences from our thriving community of families, students, and accomplished graduates.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-lg border border-[#122452]/20 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:shadow-xl hover:shadow-[#122452]/20 transition-all bg-white dark:bg-slate-900"
            >
              <div className="space-y-4">
                {/* Rating Stars (Deep Navy / White fill) */}
                <div className="flex items-center gap-1 text-[#122452] dark:text-white">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#122452] dark:fill-white text-[#122452] dark:text-white" />
                  ))}
                </div>
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-[#122452]/40 dark:text-slate-400" />
                {/* Quote text */}
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic font-normal">
                  "{item.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#122452] text-white font-semibold flex items-center justify-center text-sm shadow-md border border-[#122452]">
                  {item.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-sora font-semibold text-[#122452] dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
