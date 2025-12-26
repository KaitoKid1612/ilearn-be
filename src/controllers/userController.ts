import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { userService } from '../services/userService';
import { ResponseHandler } from '../utils/responseHandler';
import { getPaginationParams, getSkip, getPaginationMeta } from '../utils/pagination';
import { AppError } from '../middlewares/errorHandler';

class UserController {
  /**
   * Get all users (Admin only)
   * GET /api/v1/users
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const skip = getSkip(page, limit);

    const orderByField = sortBy || 'createdAt';
    const orderByValue = sortOrder || 'desc';
    const orderBy: Record<string, string> = { [orderByField]: orderByValue };

    const [users, total] = await Promise.all([
      userService.getAllUsers({
        skip,
        take: limit,
        orderBy,
      }),
      userService.count(),
    ]);

    const meta = getPaginationMeta(page, limit, total);

    ResponseHandler.success(res, users, 'Users fetched successfully', 200, meta);
  }

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const user = await userService.findUserById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    ResponseHandler.success(res, user, 'User fetched successfully');
  }

  /**
   * Update user profile
   * PUT /api/v1/users/:id
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const currentUserId = authReq.user?.id;
    const currentUserRole = authReq.user?.role;

    // Check if user can update this profile
    if (currentUserId !== id && currentUserRole !== 'ADMIN') {
      throw new AppError('You can only update your own profile', 403);
    }

    const { name, avatar } = req.body as { name?: string; avatar?: string };

    const user = await userService.updateProfile(id, { name, avatar });

    ResponseHandler.success(res, user, 'Profile updated successfully');
  }

  /**
   * Delete user (Admin only)
   * DELETE /api/v1/users/:id
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await userService.deleteUser(id);

    ResponseHandler.success(res, null, 'User deleted successfully');
  }

  /**
   * Get current user profile
   * GET /api/v1/users/me
   */
  async getMyProfile(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await userService.findUserById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    ResponseHandler.success(res, user, 'Profile fetched successfully');
  }

  /**
   * Update current user profile
   * PUT /api/v1/users/me
   */
  async updateMyProfile(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, avatar } = req.body as { name?: string; avatar?: string };

    const user = await userService.updateProfile(userId, { name, avatar });

    ResponseHandler.success(res, user, 'Profile updated successfully');
  }
}

export const userController = new UserController();
