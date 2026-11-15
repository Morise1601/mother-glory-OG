'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import type { StaffRoleOption, PermissionOption } from '@/types/staff.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roles: StaffRoleOption[];
  permissions: PermissionOption[];
}

export default function InviteStaffDrawer({ isOpen, onClose, onSuccess, roles, permissions }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(roles.find(role => role.slug === 'staff')?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  if (!isOpen) return null;
  const selected = roles.find(role => role.id === roleId);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const response = await fetch('/api/admin/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), email: email.trim(), roleId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create the staff account.');
      setMessage(data.message);
      if (data.warning) window.dispatchEvent(new CustomEvent('admin-warning', { detail: data.warning }));
      setName(''); setEmail('');
      onSuccess?.();
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to create the staff account.'); }
    finally { setLoading(false); }
  }

  return <div role="dialog" aria-modal="true" aria-labelledby="invite-title" className="fixed inset-0 z-50 flex justify-end bg-black/50 p-0 sm:p-4">
    <div className="h-full w-full max-w-lg overflow-auto bg-white p-6 shadow-xl sm:rounded-2xl">
      <div className="mb-6 flex items-start justify-between gap-3"><div><h2 id="invite-title" className="font-serif text-xl font-bold text-[#122452]">Invite staff member</h2><p className="mt-1 text-xs text-[#596579]">Assign a role and email a secure password setup link.</p></div><button type="button" onClick={onClose} disabled={loading} aria-label="Close invitation" className="p-2"><X className="h-5 w-5" /></button></div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">{message}</p>}
      <form onSubmit={submit} className="space-y-5">
        <label className="block text-sm font-semibold text-[#122452]">Full name<input required minLength={2} maxLength={100} value={name} onChange={event => setName(event.target.value)} autoComplete="name" className="mt-1 block w-full rounded-xl border border-[#DFE3EA] px-3 py-2 font-normal" /></label>
        <label className="block text-sm font-semibold text-[#122452]">Email address<input required type="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" className="mt-1 block w-full rounded-xl border border-[#DFE3EA] px-3 py-2 font-normal" /></label>
        <label className="block text-sm font-semibold text-[#122452]">Role<select required value={roleId} onChange={event => setRoleId(event.target.value)} className="mt-1 block w-full rounded-xl border border-[#DFE3EA] px-3 py-2 font-normal"><option value="" disabled>Select a role</option>{roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
        <div className="rounded-xl bg-[#FAF8F3] p-4 text-xs text-[#596579]"><p className="font-semibold text-[#122452]">Permissions included</p>{selected?.slug === 'super-admin' ? <p className="mt-2">Full administrative access.</p> : <ul className="mt-2 space-y-1">{permissions.filter(permission => selected?.permissionIds.includes(permission.id)).map(permission => <li key={permission.id}>{permission.key}</li>)}{!selected?.permissionIds.length && <li>No module permissions are assigned to this role.</li>}</ul>}</div>
        <button type="submit" disabled={loading || !roleId} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B68A35] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Create account and send setup link</button>
      </form>
    </div>
  </div>;
}
