import type { Request, Response, NextFunction } from 'express';
import { unauthorized } from '../errors/error.js';

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    throw unauthorized('Authentication required');
  }
  next();
}
