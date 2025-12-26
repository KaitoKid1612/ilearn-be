import express from 'express';
import { userController } from '../controllers/userController';
import { asyncHandler, authenticate, authorize, validate } from '../middlewares';
import { validateUUID, validatePagination } from '../validators/common';
import { updateProfileValidator } from '../validators/user.validator';

const router = express.Router();

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(userController.getMyProfile.bind(userController)));

/**
 * @route   PUT /api/v1/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/me',
  authenticate,
  validate(updateProfileValidator),
  asyncHandler(userController.updateMyProfile.bind(userController))
);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(validatePagination()),
  asyncHandler(userController.getAllUsers.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  validate([validateUUID('id')]),
  asyncHandler(userController.getUserById.bind(userController))
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private (Own profile or Admin)
 */
router.put(
  '/:id',
  authenticate,
  validate([validateUUID('id'), ...updateProfileValidator]),
  asyncHandler(userController.updateUser.bind(userController))
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate([validateUUID('id')]),
  asyncHandler(userController.deleteUser.bind(userController))
);

export default router;
