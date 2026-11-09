import { getSiteCount as readSiteCount, recordVisitorAndGetCount } from './visitor.repository.js';
import type { RecordVisitorInput, VisitorCountResponse } from './visitor.types.js';

export async function recordVisitor(input: RecordVisitorInput): Promise<VisitorCountResponse> {
  return recordVisitorAndGetCount(input.siteId, input.visitorId);
}

export async function getSiteCount(siteId: string): Promise<VisitorCountResponse> {
  return readSiteCount(siteId);
}
