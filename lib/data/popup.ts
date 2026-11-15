import 'server-only';
import type { WelcomePopupSettings } from '@/types/content.types';
import { INITIAL_WELCOME_POPUP } from '@/lib/data/content-defaults';
import { readContent, updateContent } from '@/lib/data/content-store';
import { assertVersion } from '@/lib/data/content-errors';

export async function getWelcomePopup(): Promise<WelcomePopupSettings> {
  try {
    const loaded = await readContent<WelcomePopupSettings>('welcome_popup', INITIAL_WELCOME_POPUP);
    return {
      ...INITIAL_WELCOME_POPUP,
      ...(loaded || {}),
    };
  } catch (error) {
    console.error('Failed to read welcome popup content:', error);
    return structuredClone(INITIAL_WELCOME_POPUP);
  }
}

export async function getPublicWelcomePopup(): Promise<WelcomePopupSettings | null> {
  try {
    const popup = await getWelcomePopup();
    if (!popup || !popup.isEnabled) return null;
    const now = Date.now();
    if (popup.startsAt) {
      const startMs = Date.parse(popup.startsAt);
      if (!isNaN(startMs) && startMs > now) return null;
    }
    if (popup.endsAt) {
      const endMs = Date.parse(popup.endsAt);
      if (!isNaN(endMs) && endMs < now) return null;
    }
    return popup;
  } catch (error) {
    console.error('Failed to resolve public welcome popup:', error);
    return structuredClone(INITIAL_WELCOME_POPUP);
  }
}

export async function updateWelcomePopup(updates: Partial<WelcomePopupSettings>): Promise<WelcomePopupSettings> {
  return updateContent<WelcomePopupSettings>('welcome_popup', INITIAL_WELCOME_POPUP, current => {
    assertVersion(current, updates.version);
    return {
      ...current,
      ...updates,
      version: (current.version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };
  });
}
