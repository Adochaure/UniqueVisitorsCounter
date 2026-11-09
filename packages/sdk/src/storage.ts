import { v4 as uuidv4 } from 'uuid';
import { CounterError } from './errors.js';

const COUNT_KEY_SUFFIX = ':count';

export function getOrCreateVisitorId(storageKey: string): string {
  if (typeof window === 'undefined') {
    throw new CounterError('The visitor counter can only be used in a browser.');
  }

  try {
    const existingId = window.localStorage.getItem(storageKey);
    if (existingId) return existingId;

    const visitorId = uuidv4();
    window.localStorage.setItem(storageKey, visitorId);
    return visitorId;
  } catch {
    throw new CounterError('Unable to access localStorage for the visitor ID.');
  }
}

export function getCachedCount(storageKey: string): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(`${storageKey}${COUNT_KEY_SUFFIX}`);
    if (value === null) return null;
    const count = Number(value);
    return Number.isSafeInteger(count) && count >= 0 ? count : null;
  } catch {
    return null;
  }
}

export function saveCachedCount(storageKey: string, count: number): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(`${storageKey}${COUNT_KEY_SUFFIX}`, String(count));
  } catch {
    // Counting succeeds even when the browser cannot save the display cache.
  }
}
