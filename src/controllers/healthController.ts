import { Request, Response } from 'express';
import { ResponseHandler } from '@utils/responseHandler';

export const healthCheck = (_req: Request, res: Response): void => {
  ResponseHandler.success(
    res,
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'Service is healthy'
  );
};
