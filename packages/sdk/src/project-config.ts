import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { CounterError } from './errors.js';

interface ProjectConfig {
  siteId: string;
}

export async function ensureProjectSiteId(
  directory = process.cwd(),
): Promise<{ siteId: string; created: boolean }> {
  const configPath = resolve(directory, '.uvc.json');

  try {
    const existing = JSON.parse(await readFile(configPath, 'utf8')) as Partial<ProjectConfig>;
    if (typeof existing.siteId !== 'string' || !existing.siteId.startsWith('site_')) {
      throw new CounterError(`The siteId in ${configPath} is invalid.`);
    }
    return { siteId: existing.siteId, created: false };
  } catch (error) {
    if (error instanceof CounterError) throw error;
    if (typeof error !== 'object' || error === null || !('code' in error) || error.code !== 'ENOENT') {
      throw error;
    }
  }

  const siteId = `site_${randomUUID()}`;
  try {
    await writeFile(configPath, `${JSON.stringify({ siteId }, null, 2)}\n`, { flag: 'wx' });
    return { siteId, created: true };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'EEXIST') {
      return ensureProjectSiteId(directory);
    }
    throw error;
  }
}
