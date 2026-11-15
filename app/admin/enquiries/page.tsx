"use client";

import { useEffect, useState } from 'react';
import AdminPageWrapper from '@/components/admin/AdminPageWrapper';
import PageLoader from '@/components/ui/PageLoader';
import { Loader2 } from 'lucide-react';
import type { Enquiry, EnquiryStatus } from '@/types/content.types';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [canAssign, setCanAssign] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [staff, setStaff] = useState<{ id: string; name: string }[]>([]);
  const selected = enquiries.find(item => item.id === selectedId);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/enquiries', { cache: 'no-store' }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load enquiries');
      if (cancelled) return;
      setEnquiries(data.enquiries);
      setCanAssign(data.canAssign);
      setCanUpdate(data.canUpdate);
      setStaff(data.assignees || []);
    }).catch(error => { if (!cancelled) setError(error.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function update(payload: Record<string, string>) {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The update could not be saved');
      setEnquiries(data.enquiries);
      if (data.warning) setError(data.warning);
      if (payload.action === 'note') setNewNote('');
    } catch (error) { setError(error instanceof Error ? error.message : 'The update could not be saved'); }
    finally { setBusy(false); }
  }

  const visible = enquiries.filter(item => `${item.name} ${item.phone} ${item.program}`.toLowerCase().includes(search.toLowerCase()));
  const fieldClass = 'w-full px-3 py-2 rounded-xl border border-[#DFE3EA] text-sm bg-[#FAF8F3]';
  return <AdminPageWrapper title="Admission Enquiries">
    {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800">{error}</p>}
    <input aria-label="Search enquiries" placeholder="Search name, phone or program" value={search} onChange={event => setSearch(event.target.value)} className={fieldClass} />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className={`${selected ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-[#DFE3EA] p-5 overflow-x-auto`}>
        <h2 className="font-serif font-bold text-lg text-[#122452] mb-3">Student & Parent Enquiries ({visible.length})</h2>
        {loading ? <PageLoader fullScreen={false} size={180} /> : visible.length === 0 ? <p className="text-sm text-slate-600">No enquiries available.</p> : <table className="w-full text-left text-sm">
          <thead><tr className="bg-[#FAF8F3]"><th className="p-3">Candidate</th><th className="p-3">Program & Campus</th><th className="p-3">Status</th><th className="p-3">Assigned to</th></tr></thead>
          <tbody>{visible.map(item => <tr key={item.id} className="border-t border-[#DFE3EA]">
            <td className="p-3"><button onClick={() => setSelectedId(item.id)} className="font-semibold text-[#122452] underline">{item.name}</button><p className="text-xs">{item.phone}</p></td>
            <td className="p-3">{item.program}<p className="text-xs">{item.campus}</p></td><td className="p-3">{item.status.replace('_', ' ')}</td><td className="p-3">{item.assignedStaffName || 'Unassigned'}</td>
          </tr>)}</tbody>
        </table>}
      </div>
      {selected && <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DFE3EA] p-6 space-y-5">
        <div className="flex justify-between"><h3 className="font-serif text-xl font-bold text-[#122452]">{selected.name}</h3><button onClick={() => setSelectedId(null)} className="text-sm">Close</button></div>
        <div className="text-sm space-y-2"><a href={`tel:${selected.normalizedPhone}`} className="block underline">{selected.phone}</a>{selected.email && <a href={`mailto:${selected.email}`} className="block underline">{selected.email}</a>}<p className="bg-[#FAF8F3] rounded-xl p-3 whitespace-pre-wrap">{selected.message || 'No message provided.'}</p></div>
        <label className="block text-sm font-semibold">Status<select disabled={busy || !canUpdate} value={selected.status} onChange={event => void update({ action: 'status', id: selected.id, status: event.target.value as EnquiryStatus })} className={fieldClass}>{['new', 'contacted', 'in_progress', 'closed'].map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></label>
        {canAssign && <label className="block text-sm font-semibold">Assign to staff<select disabled={busy} value={selected.assignedTo || ''} onChange={event => void update({ action: 'assign', id: selected.id, staffId: event.target.value })} className={fieldClass}><option value="" disabled>Choose staff member</option>{staff.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>}
        <div className="space-y-3"><h4 className="font-semibold text-sm">Counselling notes</h4>{selected.notes?.map(note => <div key={note.id} className="p-3 rounded-xl bg-[#FAF8F3] text-sm"><div className="flex justify-between text-xs text-slate-600"><span>{note.staffName}</span><time>{new Date(note.createdAt).toLocaleString()}</time></div><p className="whitespace-pre-wrap">{note.note}</p></div>)}</div>
        {canUpdate && <form onSubmit={event => { event.preventDefault(); void update({ action: 'note', id: selected.id, note: newNote }); }} className="space-y-2"><textarea aria-label="Private counselling note" maxLength={2000} required value={newNote} onChange={event => setNewNote(event.target.value)} className={fieldClass} /><button disabled={busy || !newNote.trim()} className="px-4 py-2 bg-[#122452] text-white rounded-xl disabled:opacity-50 flex items-center gap-1.5 cursor-pointer">{busy && <Loader2 className="w-4 h-4 animate-spin" />}<span>{busy ? 'Saving…' : 'Add note'}</span></button></form>}
      </div>}
    </div>
  </AdminPageWrapper>;
}
