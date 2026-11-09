import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ensureProjectSiteId } from '../src/project-config.js';

describe('ensureProjectSiteId', () => {
  let directory: string | undefined;

  afterEach(async () => {
    if (directory) await rm(directory, { recursive: true, force: true });
    directory = undefined;
  });

  it('creates one site ID per project and reuses it', async () => {
    directory = await mkdtemp(join(tmpdir(), 'uvc-project-'));

    const first = await ensureProjectSiteId(directory);
    const second = await ensureProjectSiteId(directory);
    const saved = JSON.parse(await readFile(join(directory, '.uvc.json'), 'utf8')) as {
      siteId: string;
    };

    expect(first.created).toBe(true);
    expect(first.siteId).toMatch(/^site_[0-9a-f-]{36}$/i);
    expect(second).toEqual({ siteId: first.siteId, created: false });
    expect(saved.siteId).toBe(first.siteId);
  });
});
