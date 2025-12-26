import { body } from 'express-validator';
import { validateEmail, validatePassword, validateString } from './common';

/**
 * Register validation
 */
export const registerValidator = [
  validateEmail('email'),
  validatePassword('password'),
  validateString('name', 2, 100),
  body('password').custom((value, { req }) => {
    const body = req.body as { confirmPassword?: string; password_confirmation?: string };
    const confirmPassword = body.confirmPassword || body.password_confirmation;
    if (value !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

/**
 * Login validation
 */
export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Forgot password validation
 */
export const forgotPasswordValidator = [validateEmail('email')];

/**
 * Reset password validation
 */
export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  validatePassword('password'),
  body(['confirmPassword', 'password_confirmation'])
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      const body = req.body as { password?: string };
      if (value !== body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * Change password validation
 */
export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  validatePassword('newPassword'),
  body(['confirmPassword', 'password_confirmation'])
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      const body = req.body as { newPassword?: string };
      if (value !== body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * Refresh token validation
 */
export const refreshTokenValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];
