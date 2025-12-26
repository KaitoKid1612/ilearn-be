import { User } from '@prisma/client';
import { BaseService } from './BaseService';
import { hashPassword } from '../utils/crypto';
import { AppError } from '../middlewares/errorHandler';

export class UserService extends BaseService<User> {
  constructor() {
    super('user');
  }

  /**
   * Get user without password
   */
  async findUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(options: {
    skip: number;
    take: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderBy: any;
  }): Promise<Omit<User, 'password'>[]> {
    const users = await this.findAll(options);

    // Remove passwords from all users
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      avatar?: string;
    }
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await this.update(userId, data);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.delete(userId);
  }

  /**
   * Update password (admin can reset user password)
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.update(userId, { password: hashedPassword });
  }
}

export const userService = new UserService();
