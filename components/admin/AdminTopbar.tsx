"use client";

import { useRouter } from "next/navigation";
import { useState } from 'react';
import type { StaffActor } from '@/lib/auth/server';
import { createBrowserClient } from "@/lib/supabase/client";
import { Menu, LogOut, Search } from "lucide-react";

interface AdminTopbarProps {
  actor: StaffActor;
  onToggleSidebar: () => void;
  title?: string;
}

export default function AdminTopbar({ onToggleSidebar, title, actor }: AdminTopbarProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/admin");
      router.refresh();
    } catch {
      setSignOutError('Sign out failed. Please try again.');
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#DFE3EA] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-[#122452] hover:bg-slate-100 border border-[#DFE3EA]"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="font-serif font-bold text-lg sm:text-xl text-[#122452] hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xs hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#596579] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Right: Notifications & User Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-3 border-l border-[#DFE3EA]">
          <div className="w-8 h-8 rounded-full bg-[#122452] text-white flex items-center justify-center font-bold text-xs">
            {actor.name.split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('')}
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-[#122452]">
            {actor.name}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="p-1.5 rounded-lg text-[#596579] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
            title="Sign Out"
            aria-label="Sign out of administration portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        {signOutError && <p role="alert" className="text-xs text-red-700">{signOutError}</p>}
      </div>
    </header>
  );
}

