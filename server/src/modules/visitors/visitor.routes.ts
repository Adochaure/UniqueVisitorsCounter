import { Router } from 'express';
import { getSiteCount, postVisitor } from './visitor.controller.js';

export const visitorRoutes = Router();
visitorRoutes.post('/', postVisitor);
visitorRoutes.get('/:siteId/count', getSiteCount);
