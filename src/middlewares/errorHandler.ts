import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '@utils/responseHandler';
import { logger } from '@utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`);
    ResponseHandler.error(res, err.message, err.statusCode);
    return;
  }

  logger.error(`Unexpected Error: ${err.message}`);
  logger.error(err.stack || '');

  ResponseHandler.error(res, 'Internal Server Error', 500, err.message);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHandler.error(res, `Route ${req.originalUrl} not found`, 404);
};
