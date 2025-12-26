import { Router } from 'express';
import { courseController } from '@controllers/courseController';
import { authenticate } from '@middlewares/auth';
import { asyncHandler } from '@middlewares/asyncHandler';
import { validate } from '@middlewares/validation';
import {
  createCourseValidator,
  updateCourseValidator,
  getCourseByIdValidator,
  deleteCourseValidator,
  enrollCourseValidator,
  getCourseProgressValidator,
} from '../validators/course.validator';

const router = Router();

/**
 * @route   GET /api/v1/courses
 * @desc    Get all courses
 * @access  Public (but returns different data for authenticated users)
 */
router.get('/', asyncHandler(courseController.getAllCourses.bind(courseController)));

/**
 * @route   GET /api/v1/courses/:id
 * @desc    Get course by ID
 * @access  Public (but shows enrollment status for authenticated users)
 */
router.get(
  '/:id',
  validate(getCourseByIdValidator),
  asyncHandler(courseController.getCourseById.bind(courseController))
);

/**
 * @route   POST /api/v1/courses
 * @desc    Create new course
 * @access  Private (Admin or Instructor)
 */
router.post(
  '/',
  authenticate,
  validate(createCourseValidator),
  asyncHandler(courseController.createCourse.bind(courseController))
);

/**
 * @route   PUT /api/v1/courses/:id
 * @desc    Update course
 * @access  Private (Admin or Author)
 */
router.put(
  '/:id',
  authenticate,
  validate([...getCourseByIdValidator, ...updateCourseValidator]),
  asyncHandler(courseController.updateCourse.bind(courseController))
);

/**
 * @route   DELETE /api/v1/courses/:id
 * @desc    Delete course
 * @access  Private (Admin or Author)
 */
router.delete(
  '/:id',
  authenticate,
  validate(deleteCourseValidator),
  asyncHandler(courseController.deleteCourse.bind(courseController))
);

/**
 * @route   POST /api/v1/courses/:id/enroll
 * @desc    Enroll in course
 * @access  Private
 */
router.post(
  '/:id/enroll',
  authenticate,
  validate(enrollCourseValidator),
  asyncHandler(courseController.enrollCourse.bind(courseController))
);

/**
 * @route   GET /api/v1/courses/:id/progress
 * @desc    Get course progress
 * @access  Private
 */
router.get(
  '/:id/progress',
  authenticate,
  validate(getCourseProgressValidator),
  asyncHandler(courseController.getCourseProgress.bind(courseController))
);

export default router;
