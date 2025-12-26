import express from 'express';
// import { authController } from '../controllers/authController';
// import { asyncHandler } from '../middlewares';
// import { validate } from '../middlewares';
// import { loginValidator, registerValidator } from '../validators/auth.validator';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
// router.post('/register', registerValidator, validate, asyncHandler(authController.register));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
// router.post('/login', loginValidator, validate, asyncHandler(authController.login));

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
// router.post('/refresh', asyncHandler(authController.refreshToken));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
// router.get('/me', authenticate, asyncHandler(authController.getMe));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
// router.post('/logout', authenticate, asyncHandler(authController.logout));

export default router;
