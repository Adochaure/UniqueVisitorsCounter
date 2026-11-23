import {
  getSiteCount as readSiteCount,
  getSiteGrowth as readSiteGrowth,
  recordVisitorAndGetCount,
} from './visitor.repository.js';
import type { RecordVisitorInput, VisitorCountResponse } from './visitor.types.js';

export async function recordVisitor(input: RecordVisitorInput): Promise<VisitorCountResponse> {
  return recordVisitorAndGetCount(input.siteId, input.visitorId);
}

export async function getSiteCount(siteId: string): Promise<VisitorCountResponse> {
  return readSiteCount(siteId);
}

export async function getSiteGrowth(siteId: string, days: number) {
  return readSiteGrowth(siteId, days);
}
