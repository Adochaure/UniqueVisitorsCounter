import { Pool } from 'pg';
import { env } from '../config/env.js';

// Pool construction only; query and migration behavior is intentionally out of scope.
export const databasePool = env.databaseUrl
  ? new Pool({
      connectionString: env.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    })
  : null;
