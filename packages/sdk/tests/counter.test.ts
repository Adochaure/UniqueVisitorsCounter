import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCounter } from '../src/index.js';

describe('createCounter', () => {
  const values = new Map<string, string>();
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    values.clear();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () =>
      new Response(JSON.stringify({ count: 1 }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('stores one browser ID and reuses it on refresh', async () => {
    const counter = createCounter({ siteId: 'portfolio', apiUrl: 'http://localhost:3000' });

    expect(await counter.getCount()).toBe(1);
    expect(await counter.getCount()).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const firstBody = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body)) as {
      siteId: string;
      visitorId: string;
    };
    const secondBody = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body)) as {
      siteId: string;
      visitorId: string;
    };

    expect(firstBody.siteId).toBe('portfolio');
    expect(firstBody.visitorId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(secondBody.visitorId).toBe(firstBody.visitorId);
  });

  it('rejects an unsuccessful API response', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));
    const counter = createCounter({ siteId: 'portfolio', apiUrl: 'http://localhost:3000' });

    await expect(counter.getCount()).rejects.toThrow('HTTP 503');
  });

  it('rejects a malformed API response', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ total: 1 }), { status: 200 }));
    const counter = createCounter({ siteId: 'portfolio', apiUrl: 'http://localhost:3000' });

    await expect(counter.getCount()).rejects.toThrow('invalid count response');
  });
});
