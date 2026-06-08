export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: AppErrorCode;
  readonly details?: unknown;

  constructor(
    statusCode: number,
    code: AppErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function createAppError(
  statusCode: number,
  code: AppErrorCode,
  message: string,
  details?: unknown,
) {
  return new AppError(statusCode, code, message, details);
}

export function validationError(
  message = 'Validation failed',
  details?: unknown,
) {
  return createAppError(400, 'VALIDATION_ERROR', message, details);
}

export function unauthorized(message = 'Unauthorized', details?: unknown) {
  return createAppError(401, 'UNAUTHORIZED', message, details);
}

export function forbidden(message = 'Forbidden', details?: unknown) {
  return createAppError(403, 'FORBIDDEN', message, details);
}

export function notFound(message = 'Not found', details?: unknown) {
  return createAppError(404, 'NOT_FOUND', message, details);
}

export function conflict(message = 'Conflict', details?: unknown) {
  return createAppError(409, 'CONFLICT', message, details);
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
