"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import type { StaffActor } from '@/lib/auth/server';
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import PageLoader from "@/components/ui/PageLoader";
import { Role } from "@/types/content.types";

interface AdminPageWrapperProps {
  children: React.ReactNode;
  title?: string;
  userRole?: Role;
  primaryAction?: React.ReactNode;
}

export default function AdminPageWrapper({
  children,
  title,
  primaryAction,
}: AdminPageWrapperProps) {
  const [warning, setWarning] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actor, setActor] = useState<StaffActor | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    const listener = (event: Event) => setWarning((event as CustomEvent<string>).detail);
    window.addEventListener("admin-warning", listener);
    return () => window.removeEventListener("admin-warning", listener);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/session', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to verify staff access.');
        setActor(data.actor);
      })
      .catch(error => { if (error.name !== 'AbortError') setAccessError('Unable to verify your staff session. Please sign in again.'); });
    return () => controller.abort();
  }, []);

  if (!actor) {
    if (accessError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#FAF8F3]">
          <div role="alert" className="p-6 rounded-2xl bg-white border border-red-200 shadow-md max-w-md w-full text-center space-y-4">
            <p className="text-sm text-red-700 font-medium">{accessError}</p>
            <Link
              href="/admin"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#122452] text-white text-xs font-semibold hover:bg-[#1b357a] transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      );
    }
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <AdminSidebar
        actor={actor}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
        <AdminTopbar
          title={title}
          actor={actor}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24 overflow-y-auto">
          {/* Top Title & Primary Action Header */}
          {(title || primaryAction) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DFE3EA]">
              <div>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#122452]">
                  {title}
                </h1>
                <p className="text-xs text-[#596579] mt-0.5">
                  Mother Glory Coaching & Tutorial Centre Management Portal
                </p>
              </div>
              {primaryAction && <div>{primaryAction}</div>}
            </div>
          )}

          {warning && <p role="status" className="p-4 rounded-xl bg-amber-50 text-amber-900 text-sm">{warning}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}

