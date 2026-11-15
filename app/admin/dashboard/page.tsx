"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminPageWrapper from '@/components/admin/AdminPageWrapper';
import PageLoader from '@/components/ui/PageLoader';
import type { AuditLogItem } from '@/types/content.types';

type DashboardData = { stats: { programs: number | null; achievements: number | null; staff: number | null; enquiriesTotal: number | null; enquiriesNew: number | null }; activity: AuditLogItem[]; permissions: string[]; isSuperAdmin: boolean };
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetch('/api/admin/dashboard', { cache: 'no-store' }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load dashboard');
      if (active) setData(result);
    }).catch(error => { if (active) setError(error.message); });
    return () => { active = false; };
  }, []);
  const cards = data ? [
    { label: 'Published programs', value: data.stats.programs, href: '/admin/programs' },
    { label: 'Published achievements', value: data.stats.achievements, href: '/admin/achievements' },
    { label: 'Staff members', value: data.stats.staff, href: '/admin/staff' },
    { label: 'Enquiries', value: data.stats.enquiriesTotal, href: '/admin/enquiries' },
  ].filter(card => card.value !== null) : [];
  const actions = [
    { label: 'Homepage banners', href: '/admin/banners', permission: 'promotions.view' },
    { label: 'Achievements', href: '/admin/achievements', permission: 'gallery.view' },
    { label: 'Staff & permissions', href: '/admin/staff', permission: 'staff.view' },
    { label: 'Institution settings', href: '/admin/settings', permission: 'settings.manage' },
    { label: 'Test Google reviews', href: '/admin/reviews', permission: 'settings.manage' },
  ].filter(action => data && (data.isSuperAdmin || data.permissions.includes(action.permission)));
  return <AdminPageWrapper title="Dashboard">
    {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800">{error}</p>}
    {!data && !error && <PageLoader fullScreen={false} size={200} />}
    {data && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{cards.map(card => <Link key={card.href} href={card.href} className="p-6 bg-white border border-[#DFE3EA] rounded-2xl"><p className="text-sm text-slate-600">{card.label}</p><p className="text-3xl font-serif font-bold text-[#122452] mt-2">{card.value}</p></Link>)}</div>
        {data.stats.enquiriesNew !== null && <p className="text-sm text-slate-600">New enquiries: {data.stats.enquiriesNew}</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{actions.map(action => <Link key={action.href} href={action.href} className="rounded-xl border border-[#DFE3EA] bg-white px-5 py-4 text-sm font-semibold text-[#122452] hover:border-[#B68A35]">{action.label} →</Link>)}</div>
        {(data.isSuperAdmin || data.permissions.includes('logs.view')) && <div className="p-6 bg-white border border-[#DFE3EA] rounded-2xl space-y-4"><h2 className="text-xl font-serif font-bold text-[#122452]">Recent activity</h2>{data.activity.length ? data.activity.map(item => <div key={item.id} className="border-t border-[#DFE3EA] pt-3 text-sm"><p>{item.summary}</p><p className="text-xs text-slate-500">{item.actorName} · {new Date(item.createdAt).toLocaleString()}</p></div>) : <p className="text-sm text-slate-600">No recorded activity.</p>}<Link href="/admin/audit" className="inline-block text-sm underline">View audit trail</Link></div>}
      </>
    )}
  </AdminPageWrapper>;
}
