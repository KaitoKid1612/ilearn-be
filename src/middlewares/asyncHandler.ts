import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper cho async route handlers để tự động catch errors
 * Không cần try-catch trong mỗi controller
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
