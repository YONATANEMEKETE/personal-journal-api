import z from 'zod';
import 'dotenv/config';

export const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z
    .string()
    .min(1, 'SESSION_SECRET is required')
    .min(32, 'SESSION_SECRET must be at least 32 characters long'),
});

export const configs = configSchema.parse(process.env);
