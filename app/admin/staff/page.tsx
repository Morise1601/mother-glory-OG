'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import AdminPageWrapper from '@/components/admin/AdminPageWrapper';
import InviteStaffDrawer from '@/components/admin/InviteStaffDrawer';
import RoleEditor from '@/components/admin/RoleEditor';
import PageLoader from '@/components/ui/PageLoader';
import type { StaffDirectory, StaffRoleOption } from '@/types/staff.types';

export default function AdminStaffPage() {
  const router = useRouter();
  const [directory, setDirectory] = useState<StaffDirectory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [busy, setBusy] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [roleEditor, setRoleEditor] = useState<{ role: StaffRoleOption | null } | null>(null);
  const [staffEditor, setStaffEditor] = useState<{ id: string; name: string; roleIds: string[] } | null>(null);

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/staff', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load staff accounts.');
    setDirectory(data);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/staff', { cache: 'no-store', signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load staff accounts.');
      setDirectory(data);
    }).catch(error => { if (error.name !== 'AbortError') setError(error.message); });
    return () => controller.abort();
  }, []);

  async function mutate(body: Record<string, unknown>) {
    setBusy(true); setError(null); setNotice(null);
    try {
      const response = await fetch('/api/admin/staff', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update this staff account.');
      setNotice(data.warning || (body.action === 'resend_invite' ? 'A secure setup link has been sent.' : 'Staff access has been saved.'));
      await load(); router.refresh(); return true;
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to update this staff account.'); return false; }
    finally { setBusy(false); }
  }

  const staff = (directory?.staff || []).filter(member => (roleFilter === 'all' || member.roleIds.includes(roleFilter)) && (statusFilter === 'all' || member.status === statusFilter) && `${member.name} ${member.email}`.toLowerCase().includes(search.toLowerCase()));
  const availableRoles = (directory?.roles || []).filter(role => role.isActive && (directory?.isSuperAdmin || role.slug !== 'super-admin'));
  const inviteRoles = availableRoles.filter(role => directory?.canManageRoles || role.slug === 'staff');
  const refresh = () => { load().catch(error => setError(error.message)); router.refresh(); };

  return <AdminPageWrapper title="Staff & access management" primaryAction={directory?.canCreateStaff ? <button type="button" onClick={() => setInviting(true)} className="flex items-center gap-2 rounded-xl bg-[#B68A35] px-4 py-2.5 text-sm font-semibold text-white"><UserPlus className="h-4 w-4" />Invite staff</button> : undefined}>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}
    {!directory && !error && <PageLoader fullScreen={false} size={180} />}
    {directory && <>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#DFE3EA] bg-white p-4"><label className="relative flex-1"><span className="sr-only">Search staff</span><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#596579]" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search staff by name or email" className="w-full min-w-48 rounded-xl border border-[#DFE3EA] py-2 pl-9 pr-3 text-sm" /></label><select aria-label="Filter by role" value={roleFilter} onChange={event => setRoleFilter(event.target.value)} className="rounded-xl border border-[#DFE3EA] p-2 text-sm"><option value="all">All roles</option>{directory.roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}</select><select aria-label="Filter by status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="rounded-xl border border-[#DFE3EA] p-2 text-sm"><option value="all">All statuses</option>{['active', 'inactive', 'on_leave', 'suspended'].map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></div>
      <div className="overflow-x-auto rounded-2xl border border-[#DFE3EA] bg-white"><table className="w-full text-left text-sm"><thead className="border-b border-[#DFE3EA] bg-[#FAF8F3] text-xs uppercase text-[#596579]"><tr><th className="p-4">Staff member</th><th className="p-4">Roles</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody className="divide-y divide-[#DFE3EA]">{staff.map(member => <tr key={member.id}><td className="p-4"><p className="font-semibold text-[#122452]">{member.name}</p><p className="mt-1 text-xs text-[#596579]">{member.email}</p><p className="mt-1 text-xs text-[#596579]">{member.employeeId}</p></td><td className="p-4"><div className="flex flex-wrap gap-1">{member.roleIds.map(id => <span key={id} className="rounded-md bg-slate-100 px-2 py-1 text-xs">{directory.roles.find(role => role.id === id)?.name || 'Unknown role'}</span>)}{!member.roleIds.length && <span className="text-xs text-amber-700">No assigned role</span>}</div></td><td className="p-4"><select aria-label={`Status for ${member.name}`} value={member.status} disabled={!directory.canEditStaff || busy} onChange={event => mutate({ id: member.id, action: 'toggle_status', status: event.target.value })} className="rounded-lg border border-[#DFE3EA] p-2 text-xs">{['active', 'inactive', 'on_leave', 'suspended'].map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></td><td className="p-4"><div className="flex flex-wrap gap-2">{directory.canEditStaff && directory.canManageRoles && <button type="button" disabled={busy} onClick={() => setStaffEditor({ id: member.id, name: member.name, roleIds: member.roleIds })} className="rounded-lg border border-[#DFE3EA] px-3 py-2 text-xs">Assign roles</button>}{directory.canCreateStaff && directory.canEditStaff && member.status === 'active' && <button type="button" disabled={busy} onClick={() => mutate({ id: member.id, action: 'resend_invite' })} className="rounded-lg border border-[#DFE3EA] px-3 py-2 text-xs">Send setup link</button>}</div></td></tr>)}</tbody></table>{!staff.length && <p className="p-6 text-center text-sm text-[#596579]">No staff accounts match these filters.</p>}</div>
      {directory.canManageRoles && <section className="space-y-4"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold text-[#122452]">Roles & permissions</h2><button type="button" onClick={() => setRoleEditor({ role: null })} className="rounded-xl border border-[#DFE3EA] bg-white px-4 py-2 text-sm">Create role</button></div><div className="grid gap-4 lg:grid-cols-2">{directory.roles.map(role => <div key={role.id} className="rounded-2xl border border-[#DFE3EA] bg-white p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-[#122452]">{role.name}{!role.isActive && ' (inactive)'}</h3>{role.slug !== 'super-admin' && <button type="button" onClick={() => setRoleEditor({ role })} className="text-xs font-semibold underline">Edit role</button>}</div><p className="mt-2 text-xs text-[#596579]">{role.description || role.slug}</p><p className="mt-3 text-xs text-[#596579]">{role.slug === 'super-admin' ? 'Protected system role with full administrative access.' : directory.permissions.filter(permission => role.permissionIds.includes(permission.id)).map(permission => permission.key).join(', ') || 'No module permissions assigned.'}</p></div>)}</div></section>}
      {inviting && <InviteStaffDrawer isOpen onClose={() => setInviting(false)} onSuccess={refresh} roles={inviteRoles} permissions={directory.permissions} />}
      {roleEditor && <RoleEditor role={roleEditor.role} permissions={directory.permissions} canManagePermissions={directory.canManagePermissions} onClose={() => setRoleEditor(null)} onSaved={refresh} />}
      {staffEditor && <div role="dialog" aria-modal="true" aria-labelledby="assign-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><form onSubmit={async event => { event.preventDefault(); if (await mutate({ id: staffEditor.id, action: 'update_roles', roleIds: staffEditor.roleIds })) setStaffEditor(null); }} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6"><h2 id="assign-title" className="font-serif text-xl font-bold text-[#122452]">Assign roles to {staffEditor.name}</h2><p className="text-xs text-[#596579]">Permissions from every assigned active role are combined.</p>{availableRoles.map(role => <label key={role.id} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={staffEditor.roleIds.includes(role.id)} onChange={event => setStaffEditor({ ...staffEditor, roleIds: event.target.checked ? [...staffEditor.roleIds, role.id] : staffEditor.roleIds.filter(id => id !== role.id) })} />{role.name}</label>)}<div className="flex justify-end gap-3"><button type="button" onClick={() => setStaffEditor(null)} disabled={busy} className="rounded-xl border border-[#DFE3EA] px-4 py-2 text-sm">Cancel</button><button type="submit" disabled={busy || !staffEditor.roleIds.length} className="flex items-center gap-1.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer">{busy && <Loader2 className="w-4 h-4 animate-spin" />}<span>{busy ? 'Saving…' : 'Save assignments'}</span></button></div></form></div>}
    </>}
  </AdminPageWrapper>;
}
