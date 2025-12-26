import { body, ValidationChain } from 'express-validator';
import { validateString, optionalField } from './common';

/**
 * Update profile validation
 */
export const updateProfileValidator: ValidationChain[] = [
  optionalField(validateString('name', 2, 100)),
  optionalField(body('avatar').isURL().withMessage('Avatar must be a valid URL')),
];
