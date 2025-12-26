import express from 'express';
// import { userController } from '../controllers/userController';
// import { asyncHandler, authenticate, authorize } from '../middlewares';
// import { validateUUID, validatePagination } from '../validators/common';
// import { validate } from '../middlewares';

const router = express.Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
// router.get(
//   '/',
//   authenticate,
//   authorize('admin'),
//   validatePagination(),
//   validate,
//   asyncHandler(userController.getAllUsers)
// );

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
// router.get(
//   '/:id',
//   authenticate,
//   validateUUID('id'),
//   validate,
//   asyncHandler(userController.getUserById)
// );

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private
 */
// router.put(
//   '/:id',
//   authenticate,
//   validateUUID('id'),
//   validate,
//   asyncHandler(userController.updateUser)
// );

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private/Admin
 */
// router.delete(
//   '/:id',
//   authenticate,
//   authorize('admin'),
//   validateUUID('id'),
//   validate,
//   asyncHandler(userController.deleteUser)
// );

export default router;
