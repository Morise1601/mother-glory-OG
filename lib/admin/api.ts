export function reportAdminWarning(data: { warning?: string }) {
  if (data.warning && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('admin-warning', { detail: data.warning }));
}

export async function adminRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The request could not be completed. Please retry.');
  reportAdminWarning(data);
  return data;
}
