import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware để log request details
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { method, originalUrl, body, query } = req;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const ip = req.ip;

  logger.info(`[${method}] ${originalUrl}`, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ip,
    query: query as Record<string, unknown>,
    body: method !== 'GET' ? (body as Record<string, unknown>) : undefined,
    timestamp: new Date().toISOString(),
  });

  next();
};
