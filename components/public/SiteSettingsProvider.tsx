"use client";
import { createContext, useContext } from 'react';
import type { SiteSettings } from '@/types/content.types';
import { DEFAULT_SETTINGS } from '@/lib/data/content-defaults';

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);
export function useSiteSettings() { return useContext(SiteSettingsContext); }
export default function SiteSettingsProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}
