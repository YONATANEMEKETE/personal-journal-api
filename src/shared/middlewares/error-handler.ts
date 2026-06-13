import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { isAppError } from '../errors/error.js';
import { sendErrorResponse } from '../utils/response.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    req.log.warn(
      { err, event: 'validation_error' },
      'Request validation failed',
    );
    sendErrorResponse(
      res,
      400,
      'VALIDATION_ERROR',
      'Invalid request data',
      details,
    );
    return;
  }

  if (isAppError(err)) {
    req.log.error(
      { err, event: err.code.toLowerCase() },
      'Request processing failed',
    );
    sendErrorResponse(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  req.log.error({ err, event: 'unexpected_error' }, 'unexpected error');
  sendErrorResponse(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred',
  );
};
