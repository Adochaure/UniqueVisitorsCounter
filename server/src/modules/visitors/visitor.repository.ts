import { databasePool } from '../../database/connection.js';
import type { VisitorCountResponse } from './visitor.types.js';

export async function recordVisitorAndGetCount(
  siteId: string,
  visitorId: string,
): Promise<VisitorCountResponse> {
  if (!databasePool) throw new Error('DATABASE_URL is not configured.');

  const client = await databasePool.connect();
  try {
    await client.query('BEGIN');
    const website = await client.query<{ id: string }>(
      `INSERT INTO websites (site_id) VALUES ($1)
       ON CONFLICT (site_id) DO UPDATE SET site_id = EXCLUDED.site_id
       RETURNING id`,
      [siteId],
    );
    const websiteId = website.rows[0]?.id;
    if (!websiteId) throw new Error('Could not resolve website record.');

    await client.query(
      `INSERT INTO visitors (website_id, visitor_id) VALUES ($1, $2)
       ON CONFLICT (website_id, visitor_id) DO NOTHING`,
      [websiteId, visitorId],
    );
    const countResult = await client.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM visitors WHERE website_id = $1',
      [websiteId],
    );
    await client.query('COMMIT');

    return { count: Number(countResult.rows[0]?.count ?? 0) };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getSiteCount(siteId: string): Promise<VisitorCountResponse> {
  if (!databasePool) throw new Error('DATABASE_URL is not configured.');

  const result = await databasePool.query<{ count: string }>(
    `SELECT COUNT(v.id)::text AS count
     FROM websites AS w
     LEFT JOIN visitors AS v ON v.website_id = w.id
     WHERE w.site_id = $1`,
    [siteId],
  );
  return { count: Number(result.rows[0]?.count ?? 0) };
}

export interface DailyVisitorCount {
  date: string;
  count: number;
}

export interface SiteGrowthResponse {
  siteId: string;
  total: number;
  days: number;
  daily: DailyVisitorCount[];
}

export async function getSiteGrowth(siteId: string, days: number): Promise<SiteGrowthResponse> {
  if (!databasePool) throw new Error('DATABASE_URL is not configured.');

  const result = await databasePool.query<{ date: string | null; count: string }>(
    `SELECT TO_CHAR((v.first_seen_at AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS date,
            COUNT(v.id)::text AS count
     FROM websites AS w
     LEFT JOIN visitors AS v
       ON v.website_id = w.id
      AND v.first_seen_at >= ((((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date - ($2::int - 1))::timestamp) AT TIME ZONE 'UTC')
      AND v.first_seen_at < ((((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date + 1)::timestamp) AT TIME ZONE 'UTC')
     WHERE w.site_id = $1
     GROUP BY w.id, (v.first_seen_at AT TIME ZONE 'UTC')::date
     ORDER BY (v.first_seen_at AT TIME ZONE 'UTC')::date`,
    [siteId, days],
  );

  // The lifetime total is returned separately so the UI can show it with the chart.
  const totalResult = await databasePool.query<{ count: string }>(
    `SELECT COUNT(v.id)::text AS count
     FROM websites AS w
     LEFT JOIN visitors AS v ON v.website_id = w.id
     WHERE w.site_id = $1`,
    [siteId],
  );

  return {
    siteId,
    total: Number(totalResult.rows[0]?.count ?? 0),
    days,
    daily: result.rows
      .filter((row): row is { date: string; count: string } => row.date !== null)
      .map((row) => ({ date: row.date, count: Number(row.count) })),
  };
}
