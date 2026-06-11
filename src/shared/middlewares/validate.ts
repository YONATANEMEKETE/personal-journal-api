import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function validate(
  schema: ZodSchema,
  source: 'body' | 'params' | 'query',
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req[source]);
    if (source === 'query') {
      Object.defineProperty(req, 'query', {
        value: parsed,
        writable: true,
        configurable: true,
      });
    } else {
      req[source] = parsed;
    }
    next();
  };
}
