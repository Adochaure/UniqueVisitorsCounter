'use client';

import { createElement, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { createCounter } from './index.js';
import type { CounterOptions } from './types.js';

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

  useEffect(() => {
    let isMounted = true;
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
  }, [siteId, apiUrl, storageKey]);

  return createElement('span', { className, 'aria-live': 'polite' }, count === null ? '' : String(count));
}
