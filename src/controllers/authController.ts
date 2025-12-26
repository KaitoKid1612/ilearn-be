import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/authService';
import { ResponseHandler } from '../utils/responseHandler';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';

class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, name } = req.body;

    const result = await authService.register({ email, password, name });

    ResponseHandler.created(
      res,
      result,
      'User registered successfully'
    );
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    ResponseHandler.success(
      res,
      result,
      'Login successful'
    );
  }

  /**
   * Get current user
   * GET /api/v1/auth/me
   */
  async getMe(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    ResponseHandler.success(res, user, 'User fetched successfully');
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken);

      // Get user to ensure still exists
      const user = await authService.getUserById(decoded.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Generate new access token
      const { generateAccessToken } = await import('../utils/jwt');
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      ResponseHandler.success(
        res,
        { accessToken },
        'Token refreshed successfully'
      );
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  async logout(_req: Request, res: Response): Promise<void> {
    // In JWT, logout is handled on client side by removing tokens
    // Server can implement token blacklist if needed
    ResponseHandler.success(res, null, 'Logout successful');
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(userId, currentPassword, newPassword);

    ResponseHandler.success(res, null, 'Password changed successfully');
  }

  /**
   * Forgot password
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const user = await authService.getUserByEmail(email);

    // Don't reveal if email exists or not
    ResponseHandler.success(
      res,
      null,
      'If the email exists, a reset link will be sent'
    );

    // TODO: Implement email sending logic
    // Generate reset token, save to DB, send email
    if (user) {
      // Send reset email
      console.log(`Reset password email would be sent to: ${email}`);
    }
  }

  /**
   * Reset password
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body;

    // TODO: Implement reset token verification
    // Verify token from DB, check expiration, update password
    
    ResponseHandler.success(res, null, 'Password reset successfully');
    console.log(`Reset password with token: ${token}, new password length: ${password.length}`);
  }
}

export const authController = new AuthController();
