import type { Request, Response, NextFunction } from 'express';
import {
  httpRequestCounter,
  httpRequestDurationSeconds,
} from '../utils/metrics.js';

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Start a high-resolution timer
  const start = performance.now();

  // 2. Listen for the finish event on the response
  res.on('finish', () => {
    // Calculate duration in seconds
    const durationInSeconds = (performance.now() - start) / 1000;
    const status = res.statusCode.toString();
    const method = req.method;

    // 3. Resolve matched Express route template (e.g. /entries/:id) to prevent cardinality explosion
    const route = req.route ? `${req.baseUrl}${req.route.path}` : 'not_found';

    // 4. Record Counter and Histogram metrics
    httpRequestCounter.inc({ method, route, status });
    httpRequestDurationSeconds.observe(
      { method, route, status },
      durationInSeconds,
    );
  });

  next();
};
