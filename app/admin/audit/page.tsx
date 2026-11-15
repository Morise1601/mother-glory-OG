"use client";
import { useEffect, useState } from 'react';
import AdminPageWrapper from '@/components/admin/AdminPageWrapper';
import PageLoader from '@/components/ui/PageLoader';
import type { AuditLogItem } from '@/types/content.types';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch('/api/admin/audit', { cache: 'no-store' }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load audit events');
      if (active) setLogs(data.logs);
    }).catch(error => { if (active) setError(error.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const visible = logs.filter(log => `${log.summary} ${log.action} ${log.actorName}`.toLowerCase().includes(search.toLowerCase()));
  return <AdminPageWrapper title="Audit & Activity Trail">
    {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800">{error}</p>}
    <p className="text-sm text-slate-600">Recent recorded activity. Events are read-only in this portal.</p>
    <input aria-label="Search audit trail" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search audit trail" className="w-full px-4 py-3 border border-[#DFE3EA] rounded-xl bg-white" />
    <div className="overflow-x-auto rounded-2xl border border-[#DFE3EA] bg-white">
      <table className="w-full text-left text-sm"><thead><tr className="bg-[#FAF8F3]"><th className="p-4">Time</th><th className="p-4">Actor</th><th className="p-4">Action</th><th className="p-4">Module</th><th className="p-4">Summary</th></tr></thead><tbody>{visible.map(log => <tr key={log.id} className="border-t border-[#DFE3EA]"><td className="p-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td><td className="p-4">{log.actorName}</td><td className="p-4">{log.action}</td><td className="p-4">{log.module}</td><td className="p-4">{log.summary}</td></tr>)}</tbody></table>
      {loading ? <PageLoader fullScreen={false} size={180} /> : !visible.length && <p className="p-4 text-sm">No recorded events.</p>}
    </div>
  </AdminPageWrapper>;
}
