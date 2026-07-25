"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ExternalLink, Navigation, Building2 } from "lucide-react";

export default function ContactSection() {
  const [activeCampus, setActiveCampus] = useState<"puducherry" | "karaikal">("puducherry");

  const campuses = [
    {
      id: "puducherry" as const,
      name: "Puducherry Main Campus",
      address: "11, 1st Cross, Subaiya Nagar, Sanjay Gandhi Nagar, Pudupalaiyam, Puducherry, 605001",
      phone: "+91 98428 23195",
      altPhone: "+91 98944 23195",
      email: "admissions@motherglory.edu",
      embedUrl:
        "https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=Mother+Glory%2C+11%2C+1st+Cross%2C+Subaiya+Nagar%2C+Sanjay+Gandhi+Nagar%2C+Pudupalaiyam%2C+Puducherry+605001&t=&z=16&ie=UTF8&iwloc=B&output=embed",
      mapsSearchUrl:
        "https://www.google.com/maps/search/?api=1&query=Mother+Glory,+11,+1st+Cross,+Subaiya+Nagar,+Sanjay+Gandhi+Nagar,+Pudupalaiyam,+Puducherry,+605001",
    },
    {
      id: "karaikal" as const,
      name: "Karaikal Campus",
      address: "171, Church St, Karaikal, Puducherry 609602",
      phone: "+91 98428 23195",
      altPhone: "+91 98944 23195",
      email: "admissions.karaikal@motherglory.edu",
      embedUrl:
        "https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=Mother+Glory%2C+171%2C+Church+St%2C+Karaikal%2C+Puducherry+609602&t=&z=16&ie=UTF8&iwloc=B&output=embed",
      mapsSearchUrl:
        "https://www.google.com/maps/search/?api=1&query=Mother+Glory,+171,+Church+St,+Karaikal,+Puducherry+609602",
    },
  ];

  const currentCampus = campuses.find((c) => c.id === activeCampus) || campuses[0];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#060a12] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-[#122452] text-amber-300 text-xs font-normal uppercase tracking-wider border border-slate-700">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Our Campus Locations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight">
            Visit Mother Glory <span className="text-amber-400">Campuses</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Explore our state-of-the-art educational facilities in Puducherry and Karaikal. Switch between campus locations on Google Maps below.
          </p>
        </div>

        {/* Main Grid: Info + Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

          {/* Left Side: Contact Cards & Campus Switcher */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Campus Selector Buttons */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 grid grid-cols-2 gap-2">
              {campuses.map((campus) => (
                <button
                  key={campus.id}
                  onClick={() => setActiveCampus(campus.id)}
                  className={`py-3 px-4 rounded-md text-xs sm:text-sm font-sora font-semibold transition-all flex items-center justify-center gap-2 border ${
                    activeCampus === campus.id
                      ? "bg-[#122452] text-white border-white/20 shadow-md"
                      : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{campus.id === "puducherry" ? "Puducherry" : "Karaikal"}</span>
                </button>
              ))}
            </div>

            {/* Selected Campus Detail Card */}
            <div className="p-6 sm:p-8 rounded-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6 flex-grow">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-normal uppercase tracking-wider text-amber-400">Selected Location</span>
                  <h3 className="text-xl font-sora font-semibold text-white mt-1">{currentCampus.name}</h3>
                </div>
                <div className="p-3 rounded-lg bg-[#122452] text-white">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-5 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-sora font-semibold text-white uppercase tracking-wider mb-1">Address</h4>
                    <p className="leading-relaxed font-normal text-slate-200">{currentCampus.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-sora font-semibold text-white uppercase tracking-wider mb-1">Phone Helplines</h4>
                    <p className="font-normal text-slate-200">
                      <a href={`tel:${currentCampus.phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                        {currentCampus.phone}
                      </a>{" "}
                      /{" "}
                      <a href={`tel:${currentCampus.altPhone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                        {currentCampus.altPhone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-sora font-semibold text-white uppercase tracking-wider mb-1">Email</h4>
                    <p className="font-normal text-slate-200">{currentCampus.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-sora font-semibold text-white uppercase tracking-wider mb-1">Visiting Hours</h4>
                    <p className="font-normal text-slate-200">Mon - Sat: 8:00 AM - 5:00 PM IST</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <a
                  href={currentCampus.mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-lg bg-[#122452] text-white hover:bg-[#1b3260] font-sora font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/20 transition-all shadow-lg hover:shadow-xl"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 ml-1" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Side: Interactive Google Map Embed */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[480px]">
            <div className="relative w-full h-full min-h-[480px] rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group flex flex-col">
              <iframe
                key={activeCampus}
                title={`Google Map - ${currentCampus.name}`}
                src={currentCampus.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, width: "100%", height: "100%", minHeight: "480px" }}
                className="w-full h-full flex-grow border-0 filter grayscale-[15%] contrast-[105%] group-hover:grayscale-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Top Campus Banner Badge */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto bg-[#060a12]/90 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-800 text-xs font-sora font-semibold text-white flex items-center gap-2 shadow-lg">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Showing Google Map for {currentCampus.name}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
