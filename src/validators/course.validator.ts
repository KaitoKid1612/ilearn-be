import { body } from 'express-validator';
import { validateString, validateUUID } from './common';

/**
 * Create course validation
 */
export const createCourseValidator = [
  validateString('title', 3, 255),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
  body('thumbnail').optional().isURL().withMessage('Thumbnail must be a valid URL'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
];

/**
 * Update course validation
 */
export const updateCourseValidator = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('content').optional().isString().withMessage('Content must be a string'),
  body('thumbnail').optional().isURL().withMessage('Thumbnail must be a valid URL'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
];

/**
 * Get course by ID validation
 */
export const getCourseByIdValidator = [validateUUID('id')];

/**
 * Delete course validation
 */
export const deleteCourseValidator = [validateUUID('id')];

/**
 * Enroll course validation
 */
export const enrollCourseValidator = [validateUUID('id')];

/**
 * Get course progress validation
 */
export const getCourseProgressValidator = [validateUUID('id')];
