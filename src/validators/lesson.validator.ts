import { body } from 'express-validator';
import { validateString, validateUUID } from './common';

/**
 * Create lesson validation
 */
export const createLessonValidator = [
  validateString('title', 3, 255),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
  body('order')
    .notEmpty()
    .withMessage('Order is required')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer in minutes'),
];

/**
 * Update lesson validation
 */
export const updateLessonValidator = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('content').optional().isString().withMessage('Content must be a string'),
  body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer in minutes'),
];

/**
 * Get lesson by ID validation
 */
export const getLessonByIdValidator = [validateUUID('id')];

/**
 * Delete lesson validation
 */
export const deleteLessonValidator = [validateUUID('id')];

/**
 * Complete lesson validation
 */
export const completeLessonValidator = [validateUUID('id')];

/**
 * Get lessons by course validation
 */
export const getLessonsByCourseValidator = [validateUUID('courseId')];
