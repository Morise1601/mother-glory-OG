"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Send } from "lucide-react";
import { useSiteSettings } from "@/components/public/SiteSettingsProvider";

export default function MobileStickyBar() {
  const pathname = usePathname();
  const settings = useSiteSettings();

  // Do not show on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-t border-[#DFE3EA] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
        {/* Call Button */}
        <a
          href={"tel:" + (settings.contactPhones?.[0] || "+919842823195").replace(/[^+0-9]/g, "")}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#122452] hover:bg-[#1b3260] text-white font-semibold text-xs shadow-xs transition-colors"
          aria-label="Call Admissions Coordinator"
        >
          <Phone className="w-4 h-4 text-[#B68A35]" />
          <span>Call</span>
        </a>

        {/* Enquire Button */}
        <Link
          href="/contact"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-xs shadow-xs transition-colors"
          aria-label="Submit Admission Enquiry"
        >
          <Send className="w-4 h-4" />
          <span>Enquire Now</span>
        </Link>
      </div>
    </div>
  );
}
