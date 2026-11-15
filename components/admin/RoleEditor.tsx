'use client';

import { useState } from 'react';
import type { PermissionOption, StaffRoleOption } from '@/types/staff.types';

interface Props { role: StaffRoleOption | null; permissions: PermissionOption[]; canManagePermissions: boolean; onClose: () => void; onSaved: () => void; }

export default function RoleEditor({ role, permissions, canManagePermissions, onClose, onSaved }: Props) {
  const [name, setName] = useState(role?.name || '');
  const [slug, setSlug] = useState(role?.slug || '');
  const [description, setDescription] = useState(role?.description || '');
  const [isActive, setIsActive] = useState(role?.isActive ?? true);
  const [permissionIds, setPermissionIds] = useState(role?.permissionIds || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(null);
    try {
      const response = await fetch('/api/admin/roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: role?.id, name, slug, description, isActive, ...(canManagePermissions ? { permissionIds } : {}) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save this role.');
      if (data.warning) window.dispatchEvent(new CustomEvent('admin-warning', { detail: data.warning }));
      onSaved(); onClose();
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save this role.'); }
    finally { setSaving(false); }
  }
  return <div role="dialog" aria-modal="true" aria-labelledby="role-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-auto rounded-2xl bg-white p-6 shadow-xl">
    <h2 id="role-title" className="font-serif text-xl font-bold text-[#122452]">{role ? 'Edit role and permissions' : 'Create an access role'}</h2>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <label className="block text-sm font-semibold">Role name<input required minLength={2} maxLength={80} value={name} onChange={event => setName(event.target.value)} className="mt-1 block w-full rounded-xl border border-[#DFE3EA] p-2 font-normal" /></label>
    <label className="block text-sm font-semibold">Role identifier<input required pattern="[a-z][a-z0-9-]+" maxLength={60} readOnly={role?.isSystem} value={slug} onChange={event => setSlug(event.target.value)} placeholder="content-editor" className="mt-1 block w-full rounded-xl border border-[#DFE3EA] p-2 font-normal" /></label>
    <label className="block text-sm font-semibold">Description<textarea maxLength={500} value={description} onChange={event => setDescription(event.target.value)} className="mt-1 block w-full rounded-xl border border-[#DFE3EA] p-2 font-normal" /></label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={event => setIsActive(event.target.checked)} />Role is active</label>
    <fieldset disabled={!canManagePermissions || saving} className="space-y-3 rounded-xl border border-[#DFE3EA] p-4"><legend className="px-1 text-sm font-semibold">Permission grants</legend>{!canManagePermissions && <p className="text-xs text-[#596579]">Permission changes require permission management access.</p>}{[...new Set(permissions.map(permission => permission.module))].map(module => <div key={module}><p className="mb-1 text-xs font-semibold uppercase text-[#122452]">{module}</p><div className="grid gap-2 sm:grid-cols-2">{permissions.filter(permission => permission.module === module).map(permission => <label key={permission.id} title={permission.description || ''} className="flex items-start gap-2 text-xs"><input type="checkbox" checked={permissionIds.includes(permission.id)} onChange={event => setPermissionIds(previous => event.target.checked ? [...previous, permission.id] : previous.filter(id => id !== permission.id))} />{permission.key}</label>)}</div></div>)}</fieldset>
    <div className="flex justify-end gap-3"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-[#DFE3EA] px-4 py-2 text-sm">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-[#B68A35] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save role'}</button></div>
  </form></div>;
}
