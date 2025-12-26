import express from 'express';
import { authController } from '../controllers/authController';
import { asyncHandler, authenticate, validate } from '../middlewares';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.validator';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  validate(registerValidator),
  asyncHandler(authController.register.bind(authController))
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validate(loginValidator),
  asyncHandler(authController.login.bind(authController))
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  validate(refreshTokenValidator),
  asyncHandler(authController.refreshToken.bind(authController))
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(authController.getMe.bind(authController)));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, asyncHandler(authController.logout.bind(authController)));

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordValidator),
  asyncHandler(authController.changePassword.bind(authController))
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Forgot password
 * @access  Public
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordValidator),
  asyncHandler(authController.forgotPassword.bind(authController))
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post(
  '/reset-password',
  validate(resetPasswordValidator),
  asyncHandler(authController.resetPassword.bind(authController))
);

export default router;
