#!/usr/bin/env node
import { CounterError } from './errors.js';
import { ensureProjectSiteId } from './project-config.js';

async function main(): Promise<void> {
  const [first, second, ...extra] = process.argv.slice(2);

  if (first === 'init' && second === undefined) {
    const { siteId, created } = await ensureProjectSiteId();
    console.log(`${created ? 'Created' : 'Using existing'} site ID: ${siteId}`);
    console.log('Keep .uvc.json in this website project.');
    console.log(`React: <VisitorCount siteId="${siteId}" />`);
    console.log(`JavaScript: createCounter({ siteId: '${siteId}' })`);
    return;
  }

  const siteId = first === 'count' && second === undefined
    ? (await ensureProjectSiteId()).siteId
    : first;
  const action = first === 'count' && second === undefined ? 'count' : second;

  if (!siteId || action !== 'count' || extra.length > 0) {
    throw new CounterError('Usage: uvc init | uvc count | uvc <siteId> count');
  }

  const apiUrl = process.env.UVC_API_URL ?? 'https://uniquevisitorscounter.onrender.com';
  const response = await fetch(
    `${apiUrl.replace(/\/$/, '')}/v1/visitors/${encodeURIComponent(siteId)}/count`,
  );
  if (!response.ok) throw new CounterError(`Counter API returned HTTP ${response.status}.`);

  const result: unknown = await response.json();
  if (
    typeof result !== 'object' ||
    result === null ||
    !('count' in result) ||
    typeof result.count !== 'number'
  ) {
    throw new CounterError('Counter API returned an invalid count response.');
  }
  console.log(result.count);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Could not read visitor count.');
  process.exitCode = 1;
});
