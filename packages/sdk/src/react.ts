'use client';

import { createElement, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { createCounter } from './index.js';
import { getCachedCount } from './storage.js';
import type { CounterOptions } from './types.js';

const DEFAULT_STORAGE_KEY = 'unique-visitor-counter:visitor-id';

export interface VisitorCountProps extends CounterOptions {
  className?: string;
}

export function VisitorCount({
  siteId,
  apiUrl,
  storageKey,
  className,
}: VisitorCountProps): ReactElement {
  const [count, setCount] = useState<number | null>(null);
  const visitorStorageKey = `${storageKey ?? DEFAULT_STORAGE_KEY}:${siteId}`;

  useEffect(() => {
    let isMounted = true;
    const cachedCount = getCachedCount(visitorStorageKey);
    if (cachedCount !== null) setCount(cachedCount);

    void createCounter({ siteId, apiUrl, storageKey })
      .getCount()
      .then((value): void => {
        if (isMounted) setCount(value);
      })
      .catch((): void => {
        // Keep the previous number visible if a later fetch fails.
      });

    return (): void => {
      isMounted = false;
    };
  }, [siteId, apiUrl, storageKey, visitorStorageKey]);

  return createElement('span', { className, 'aria-live': 'polite' }, count === null ? '' : String(count));
}
