import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware.js';
import { visitorRoutes } from './modules/visitors/visitor.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(
  cors({
    origin: env.corsOrigins.length > 0 ? env.corsOrigins : env.nodeEnv === 'development' ? '*' : false,
  }),
);
app.use(express.json());

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/v1/visitors', rateLimitMiddleware, visitorRoutes);
app.use(errorMiddleware);
