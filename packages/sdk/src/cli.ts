#!/usr/bin/env node
import { CounterError } from './errors.js';

async function main(): Promise<void> {
  const [siteId, action, ...extra] = process.argv.slice(2);
  if (!siteId || action !== 'count' || extra.length > 0) {
    throw new CounterError('Usage: uvc <siteId> count');
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
