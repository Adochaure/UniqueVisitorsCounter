import { registerAndFetchCount } from './client.js';
import { CounterError } from './errors.js';
import { getOrCreateVisitorId } from './storage.js';
import type { Counter, CounterOptions } from './types.js';

const DEFAULT_API_URL = 'https://uniquevisitorscounter.onrender.com';
const DEFAULT_STORAGE_KEY = 'unique-visitor-counter:visitor-id';

export function createCounter(options: CounterOptions): Counter {
  if (!options.siteId.trim()) {
    throw new CounterError('siteId must not be empty.');
  }

  const apiUrl = options.apiUrl ?? DEFAULT_API_URL;
  const storageKey = `${options.storageKey ?? DEFAULT_STORAGE_KEY}:${options.siteId}`;

  return {
    async getCount(): Promise<number> {
      const visitorId = getOrCreateVisitorId(storageKey);
      return registerAndFetchCount(apiUrl, options.siteId, visitorId);
    },
  };
}

export { CounterError };
export type { Counter, CounterOptions };
