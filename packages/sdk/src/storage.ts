import { v4 as uuidv4 } from 'uuid';
import { CounterError } from './errors.js';

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
