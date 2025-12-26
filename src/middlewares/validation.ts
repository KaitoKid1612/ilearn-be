import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ResponseHandler } from '../utils/responseHandler';

/**
 * Middleware để validate request data với express-validator
 */
export const validate = (validations: ValidationChain[]): RequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

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
};
