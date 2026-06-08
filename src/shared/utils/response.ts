import type { Response } from 'express';

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function sendSuccessResponse<T>(
  res: Response,
  statusCode: number,
  data: T,
): void;

export function sendSuccessResponse<T>(
  res: Response,
  statusCode: number,
  items: T[],
  meta: PaginationMeta,
): void;

export function sendSuccessResponse<T>(
  res: Response,
  statusCode: number,
  dataOrItems: T | T[],
  meta?: PaginationMeta,
): void {
  if (meta && Array.isArray(dataOrItems)) {
    res.status(statusCode).json({
      data: { items: dataOrItems, meta },
    });
    return;
  }

  res.status(statusCode).json({
    data: dataOrItems,
  });
}

export function sendErrorResponse(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  });
}
