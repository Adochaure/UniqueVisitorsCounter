'use client';

import { createElement, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { createCounter } from './index.js';
import type { CounterOptions } from './types.js';

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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    void createCounter({ siteId, apiUrl, storageKey })
      .getCount()
      .then((value): void => {
        if (isMounted) setCount(value);
      })
      .catch((): void => {
        if (isMounted) setHasError(true);
      });

    return (): void => {
      isMounted = false;
    };
  }, [siteId, apiUrl, storageKey]);

  const text = hasError ? errorText : count === null ? loadingText : `${count} unique visitors`;
  return createElement('span', { className, 'aria-live': 'polite' }, text);
}
