"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "Grade 1 - 5",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#060a12] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Side: Contact Information & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#122452] text-amber-300 text-xs font-normal uppercase tracking-wider border border-slate-700">
                Get In Touch
              </div>
              <h2 className="text-3xl sm:text-4xl font-sora font-semibold tracking-tight">
                Begin Your Journey With <span className="text-amber-400">Mother Glory</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed font-normal">
                Have questions about admissions, campus visits, or curriculum details? Our admissions team is here to assist you every step of the way.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              {/* Contact Card 1 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="p-3 rounded-lg bg-[#122452] text-amber-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-sora font-semibold text-white">Campus Location</h3>
                  <p className="text-sm text-slate-300 font-normal">
                    Mother Glory Educational Campus, Main Knowledge Hub Road, Sector 12
                  </p>
                </div>
              </div>

              {/* Contact Card 2 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="p-3 rounded-lg bg-[#122452] text-amber-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-sora font-semibold text-white">Phone & Helpline</h3>
                  <p className="text-sm text-slate-300 font-normal">+1 (800) 123-4567 / +1 (800) 987-6543</p>
                </div>
              </div>

              {/* Contact Card 3 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="p-3 rounded-lg bg-[#122452] text-amber-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-sora font-semibold text-white">Email Address</h3>
                  <p className="text-sm text-slate-300 font-normal">admissions@motherglory.edu</p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="p-3 rounded-lg bg-[#122452] text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-sora font-semibold text-white">Admissions Desk Hours</h3>
                  <p className="text-sm text-slate-300 font-normal">Mon - Sat: 8:00 AM - 5:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6">

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-lg bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-sora font-semibold text-white">Thank You for Reaching Out!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto font-normal">
                    We have received your admission inquiry. Our counselor will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-lg bg-[#122452] text-white font-medium text-sm hover:bg-[#1b3260] transition-colors border border-slate-700"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-sora font-semibold text-white">Admission & Campus Inquiry</h3>
                    <p className="text-slate-400 text-sm font-normal">Fill out the form below and we'll be in touch shortly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-normal uppercase tracking-wider text-slate-300">
                        Parent's / Student's Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#122452] font-normal"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-normal uppercase tracking-wider text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#122452] font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-normal uppercase tracking-wider text-slate-300">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#122452] font-normal"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-normal uppercase tracking-wider text-slate-300">
                        Grade Level Seeking
                      </label>
                      <select
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-[#122452] font-normal"
                      >
                        <option>SSLC</option>
                        <option>+1</option>
                        <option>+2</option>
                        <option>NEET</option>
                        <option>JEE</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-normal uppercase tracking-wider text-slate-300">
                      Message / Special Queries
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please let us know if you'd like to schedule a campus tour..."
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#122452] font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-base font-medium text-white bg-[#122452] hover:bg-[#0c1839] rounded-lg shadow-xl shadow-[#122452]/40 transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <span>Submit Inquiry</span>
                    <Send className="w-5 h-5 text-amber-400" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
