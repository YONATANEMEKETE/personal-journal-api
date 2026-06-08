import type { NextFunction, Request, Response } from 'express';
import { notFound } from '../errors/error.js';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(notFound(`Route ${req.method} ${req.url} not found`));
};
