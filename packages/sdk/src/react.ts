'use client';

import { createElement, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { createCounter } from './index.js';
import { getCachedCount } from './storage.js';
import type { CounterOptions } from './types.js';

const DEFAULT_STORAGE_KEY = 'unique-visitor-counter:visitor-id';

export interface VisitorCountProps extends CounterOptions {
  className?: string;
  loadingText?: string;
  errorText?: string;
}

export function VisitorCount({
  siteId,
  apiUrl,
  storageKey,
  className,
  loadingText = 'Loading...',
  errorText = 'Count unavailable',
}: VisitorCountProps): ReactElement {
  const [count, setCount] = useState<number | null>(null);
  const [hasCheckedCache, setHasCheckedCache] = useState(false);
  const [hasError, setHasError] = useState(false);
  const visitorStorageKey = `${storageKey ?? DEFAULT_STORAGE_KEY}:${siteId}`;

  useEffect(() => {
    let isMounted = true;
    const cachedCount = getCachedCount(visitorStorageKey);
    if (cachedCount !== null) {
      setCount(cachedCount);
    } else {
      setHasCheckedCache(true);
    }

    void createCounter({ siteId, apiUrl, storageKey })
      .getCount()
      .then((value): void => {
        if (isMounted) setCount(value);
      })
      .catch((): void => {
        if (isMounted && cachedCount === null) {
          setHasCheckedCache(true);
          setHasError(true);
        }
      });

    return (): void => {
      isMounted = false;
    };
  }, [siteId, apiUrl, storageKey, visitorStorageKey]);

  const text = count !== null
    ? String(count)
    : hasError
      ? errorText
      : hasCheckedCache
        ? loadingText
        : '';
  return createElement('span', { className, 'aria-live': 'polite' }, text);
}
