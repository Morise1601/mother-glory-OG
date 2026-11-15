"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Role } from "@/types/content.types";
import type { StaffActor } from '@/lib/auth/server';
import { canAccessAdminPage } from '@/lib/auth/access';
import {
  LayoutDashboard,
  Trophy,
  ImageIcon,
  Users2,
  GraduationCap,
  FolderOpen,
  Mail,
  UserCheck,
  Star,
  Settings,
  History,
  Megaphone,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  actor: StaffActor;
  userRole?: Role;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  actor,
  isOpen = true,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      allowedRoles: ["admin", "editor", "staff"],
    },
    {
      name: "Achievements",
      href: "/admin/achievements",
      icon: Trophy,
      allowedRoles: ["admin", "editor"],
    },
    {
      name: "Banners",
      href: "/admin/banners",
      icon: ImageIcon,
      allowedRoles: ["admin", "editor"],
    },
    {
      name: "Welcome Popup",
      href: "/admin/popup",
      icon: Megaphone,
      allowedRoles: ["admin", "editor"],
    },
    {
      name: "Founders",
      href: "/admin/founders",
      icon: Users2,
      allowedRoles: ["admin", "editor"],
    },
    {
      name: "Programs",
      href: "/admin/programs",
      icon: GraduationCap,
      allowedRoles: ["admin", "editor"],
    },
    {
      name: "Media",
      href: "/admin/media",
      icon: FolderOpen,
      allowedRoles: ["admin", "editor"],
    },
    {
      name: "Enquiries",
      href: "/admin/enquiries",
      icon: Mail,
      allowedRoles: ["admin", "staff"],
    },
    {
      name: "Staff",
      href: "/admin/staff",
      icon: UserCheck,
      allowedRoles: ["admin"],
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: Star,
      allowedRoles: ["admin"],
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      allowedRoles: ["admin"],
    },
    {
      name: "Audit",
      href: "/admin/audit",
      icon: History,
      allowedRoles: ["admin"],
    },
  ];

  const visibleItems = navItems.filter((item) => canAccessAdminPage(actor, item.href));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#122452] text-white flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 border-r border-[#1b3260] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Brand Header */}
        <div className="p-4 sm:p-5 border-b border-[#1b3260] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="relative h-10 w-10 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo_mg.webp"
                alt="Mother Glory Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-sm text-white block leading-tight">
                Mother Glory
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">
                ADMINISTRATION
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Admin Navigation">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#B68A35] text-white shadow-xs font-semibold"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Role Badge */}
        <div className="p-4 border-t border-[#1b3260] bg-[#0c1836]">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{actor.email}</p>
            </div>
            <span className="px-2 py-0.5 rounded-sm bg-[#B68A35]/20 text-[#B68A35] font-semibold text-[10px] uppercase border border-[#B68A35]/40">
              {actor.role}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

