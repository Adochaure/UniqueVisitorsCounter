import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';

// Use a single process-wide bucket so no client IP is used or retained for limiting.
export const rateLimitMiddleware: RequestHandler = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: () => 'visitor-api',
  message: { error: { message: 'Request limit reached. Please try again later.' } },
});
