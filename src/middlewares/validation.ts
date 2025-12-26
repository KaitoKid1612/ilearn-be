import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ResponseHandler } from '../utils/responseHandler';

/**
 * Middleware để validate request data với express-validator
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : undefined,
      message: String(error.msg),
    }));

    ResponseHandler.error(res, 'Validation failed', 400, JSON.stringify(errorMessages));
    return;
  }

  next();
};
