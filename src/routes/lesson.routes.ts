import { Router } from 'express';
import { lessonController } from '@controllers/lessonController';
import { authenticate } from '@middlewares/auth';
import { asyncHandler } from '@middlewares/asyncHandler';
import { validate } from '@middlewares/validation';
import {
  createLessonValidator,
  updateLessonValidator,
  getLessonByIdValidator,
  deleteLessonValidator,
  completeLessonValidator,
  getLessonsByCourseValidator,
} from '../validators/lesson.validator';

const router = Router();

/**
 * @route   GET /api/v1/courses/:courseId/lessons
 * @desc    Get all lessons in a course
 * @access  Public (but shows completion status for authenticated users)
 */
router.get(
  '/courses/:courseId/lessons',
  validate(getLessonsByCourseValidator),
  asyncHandler(lessonController.getLessonsByCourse.bind(lessonController))
);

/**
 * @route   GET /api/v1/lessons/:id
 * @desc    Get lesson by ID
 * @access  Public (but shows completion status for authenticated users)
 */
router.get(
  '/:id',
  validate(getLessonByIdValidator),
  asyncHandler(lessonController.getLessonById.bind(lessonController))
);

/**
 * @route   POST /api/v1/courses/:courseId/lessons
 * @desc    Create new lesson
 * @access  Private (Admin or Course Author)
 */
router.post(
  '/courses/:courseId/lessons',
  authenticate,
  validate([...getLessonsByCourseValidator, ...createLessonValidator]),
  asyncHandler(lessonController.createLesson.bind(lessonController))
);

/**
 * @route   PUT /api/v1/lessons/:id
 * @desc    Update lesson
 * @access  Private (Admin or Course Author)
 */
router.put(
  '/:id',
  authenticate,
  validate([...getLessonByIdValidator, ...updateLessonValidator]),
  asyncHandler(lessonController.updateLesson.bind(lessonController))
);

/**
 * @route   DELETE /api/v1/lessons/:id
 * @desc    Delete lesson
 * @access  Private (Admin or Course Author)
 */
router.delete(
  '/:id',
  authenticate,
  validate(deleteLessonValidator),
  asyncHandler(lessonController.deleteLesson.bind(lessonController))
);

/**
 * @route   POST /api/v1/lessons/:id/complete
 * @desc    Mark lesson as complete
 * @access  Private
 */
router.post(
  '/:id/complete',
  authenticate,
  validate(completeLessonValidator),
  asyncHandler(lessonController.completeLesson.bind(lessonController))
);

export default router;
