import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware để log request details
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const { method, originalUrl, ip, body, query } = req;

  logger.info(`[${method}] ${originalUrl}`, {
    ip,
    query: query as Record<string, unknown>,
    body: method !== 'GET' ? (body as Record<string, unknown>) : undefined,
    timestamp: new Date().toISOString(),
  });

  next();
};
