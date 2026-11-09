import { config as loadDotenv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The Neon CLI writes its branch credentials to .env.local. Load it first so
// process-level values retain priority and .env can supply any missing values.
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
loadDotenv({ path: resolve(repositoryRoot, '.env.local') });
loadDotenv({ path: resolve(repositoryRoot, '.env') });

function readPort(value: string | undefined): number {
  if (value === undefined) return 3000;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  return port;
}

function readPositiveInteger(name: string, value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: readPort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL ?? '',
  corsOrigins: (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimitWindowMs: readPositiveInteger(
    'RATE_LIMIT_WINDOW_MS',
    process.env.RATE_LIMIT_WINDOW_MS,
    60_000,
  ),
  rateLimitMax: readPositiveInteger('RATE_LIMIT_MAX', process.env.RATE_LIMIT_MAX, 1_200),
};
