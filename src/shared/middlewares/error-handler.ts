import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import { ZodError } from 'zod';
import { isAppError } from '../errors/error.js';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    req.log.warn({ err }, 'validation failed');
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details,
      },
    });
    return;
  }

  const appError = isAppError(err) ? err : undefined;
  const statusCode = appError ? appError.statusCode : 500;
  const code = appError ? appError.code : 'INTERNAL_SERVER_ERROR';
  const message = appError ? appError.message : 'An unexpected error occurred';
  const details = appError?.details;

  req.log.error({ err }, 'request failed');

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  });
};
