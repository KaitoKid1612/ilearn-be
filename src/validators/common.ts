import { body, param, query } from 'express-validator';

/**
 * Common validation rules
 */

// UUID validation
export const validateUUID = (field: string = 'id') => {
  return param(field).isUUID().withMessage(`${field} must be a valid UUID`);
};

// Email validation
export const validateEmail = (field: string = 'email') => {
  return body(field).isEmail().withMessage('Invalid email format').normalizeEmail().trim();
};

// Password validation
export const validatePassword = (field: string = 'password') => {
  return body(field)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and number');
};

// String validation
export const validateString = (field: string, minLength: number = 1, maxLength: number = 255) => {
  return body(field)
    .isString()
    .withMessage(`${field} must be a string`)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`);
};

// Number validation
export const validateNumber = (field: string, min?: number, max?: number) => {
  let validator = body(field).isNumeric().withMessage(`${field} must be a number`);

  if (min !== undefined) {
    validator = validator.isFloat({ min }).withMessage(`${field} must be at least ${min}`);
  }

  if (max !== undefined) {
    validator = validator.isFloat({ max }).withMessage(`${field} must be at most ${max}`);
  }

  return validator;
};

// Boolean validation
export const validateBoolean = (field: string) => {
  return body(field).isBoolean().withMessage(`${field} must be a boolean`);
};

// Pagination query validation
export const validatePagination = () => {
  return [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    query('sortBy').optional().isString().trim(),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
  ];
};

// Date validation
export const validateDate = (field: string) => {
  return body(field).isISO8601().withMessage(`${field} must be a valid date`);
};

// Array validation
export const validateArray = (field: string, minLength: number = 0) => {
  return body(field)
    .isArray({ min: minLength })
    .withMessage(`${field} must be an array with at least ${minLength} items`);
};

// Optional field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const optionalField = (validator: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return validator.optional({ nullable: true, checkFalsy: false });
};
