import pino from 'pino';
import { configs } from '../configs/env.js';

export const logger = pino({
  level: configs.LOG_LEVEL,
  redact: [
    'req.headers.authorization',
    'res.headers.authorization',
    'req.headers.cookie',
    'res.headers.cookie',
  ],
  transport:
    configs.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
});
