import type { RequestHandler } from 'express';
import { getSiteCount as readSiteCount, recordVisitor } from './visitor.service.js';

export const postVisitor: RequestHandler = async (request, response, next) => {
  const { siteId, visitorId } = request.body as { siteId?: unknown; visitorId?: unknown };
  if (
    typeof siteId !== 'string' ||
    siteId.trim().length === 0 ||
    typeof visitorId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId)
  ) {
    response.status(400).json({ error: { message: 'siteId and a valid visitorId are required.' } });
    return;
  }

  try {
    response.status(200).json(await recordVisitor({ siteId: siteId.trim(), visitorId }));
  } catch (error) {
    next(error);
  }
};

export const getSiteCount: RequestHandler = async (request, response, next) => {
  const routeSiteId = request.params.siteId;
  const siteId = Array.isArray(routeSiteId) ? routeSiteId[0] : routeSiteId;
  if (!siteId?.trim()) {
    response.status(400).json({ error: { message: 'siteId is required.' } });
    return;
  }

  try {
    response.status(200).json(await readSiteCount(siteId));
  } catch (error) {
    next(error);
  }
};
