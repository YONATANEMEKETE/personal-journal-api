import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'params' | 'query') {
  return (req: Request, _res: Response, next: NextFunction) => {
    req[source] = schema.parse(req[source]);
    next();
  };
}
