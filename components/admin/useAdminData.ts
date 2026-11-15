"use client";
import { useEffect, useState } from 'react';
import { adminRequest } from '@/lib/admin/api';

export function useAdminData<T>(url: string, key: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    adminRequest<Record<string, T>>(url).then(result => {
      if (active) { setData(result[key]); setLoaded(true); }
    }).catch(error => { if (active) setError(error instanceof Error ? error.message : 'Could not load saved content.'); });
    return () => { active = false; };
  }, [url, key]);
  return { data, setData, error, setError, loaded };
}
