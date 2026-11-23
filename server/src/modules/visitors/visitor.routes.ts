import { Router } from 'express';
import { getSiteCount, getSiteGrowth, postVisitor } from './visitor.controller.js';

export const visitorRoutes = Router();
visitorRoutes.post('/', postVisitor);
visitorRoutes.get('/:siteId/growth', getSiteGrowth);
visitorRoutes.get('/:siteId/count', getSiteCount);
