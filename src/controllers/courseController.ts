import { Request, Response } from 'express';
import { courseService } from '@services/courseService';
import { ResponseHandler } from '@utils/responseHandler';
import { getPaginationParams, getSkip, getPaginationMeta } from '@utils/pagination';
import { AppError } from '@middlewares/errorHandler';
import { AuthRequest } from '@/types';

/**
 * Course Controller
 */
export class CourseController {
  /**
   * Get all courses
   * GET /api/v1/courses
   */
  async getAllCourses(req: Request, res: Response): Promise<void> {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const skip = getSkip(page, limit);

    const { isPublic, enrolled, search } = req.query;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    const orderByField = sortBy || 'createdAt';
    const orderByValue = sortOrder || 'desc';
    const orderBy: Record<string, string> = { [orderByField]: orderByValue };

    const [courses, total] = await Promise.all([
      courseService.getCourses({
        skip,
        take: limit,
        userId,
        isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
        enrolled: enrolled === 'true',
        search: search as string,
        orderBy,
      }),
      courseService.countCourses({
        userId,
        isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
        enrolled: enrolled === 'true',
        search: search as string,
      }),
    ]);

    const meta = getPaginationMeta(page, limit, total);
    ResponseHandler.success(res, { items: courses, meta }, 'Courses retrieved successfully');
  }

  /**
   * Get course by ID
   * GET /api/v1/courses/:id
   */
  async getCourseById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    const course = await courseService.getCourseById(id, userId);

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    ResponseHandler.success(res, course, 'Course retrieved successfully');
  }

  /**
   * Create new course
   * POST /api/v1/courses
   */
  async createCourse(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { title, description, content, thumbnail, isPublic } = req.body as {
      title: string;
      description?: string;
      content: string;
      thumbnail?: string;
      isPublic: boolean;
    };

    const course = await courseService.createCourse({
      title,
      description,
      content,
      thumbnail,
      isPublic: isPublic || false,
      authorId: userId,
    });

    ResponseHandler.success(res, course, 'Course created successfully', 201);
  }

  /**
   * Update course
   * PUT /api/v1/courses/:id
   */
  async updateCourse(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    // Check if course exists
    const existingCourse = await courseService.findById(id);
    if (!existingCourse) {
      throw new AppError('Course not found', 404);
    }

    // Check ownership (only author or admin can update)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    if ((existingCourse as any).authorId !== userId && authReq.user?.role !== 'ADMIN') {
      throw new AppError('Forbidden: You can only update your own courses', 403);
    }

    const { title, description, content, thumbnail, isPublic } = req.body as {
      title?: string;
      description?: string;
      content?: string;
      thumbnail?: string;
      isPublic?: boolean;
    };

    const course = await courseService.updateCourse(id, {
      title,
      description,
      content,
      thumbnail,
      isPublic,
    });

    ResponseHandler.success(res, course, 'Course updated successfully');
  }

  /**
   * Delete course
   * DELETE /api/v1/courses/:id
   */
  async deleteCourse(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    // Check if course exists
    const existingCourse = await courseService.findById(id);
    if (!existingCourse) {
      throw new AppError('Course not found', 404);
    }

    // Check ownership (only author or admin can delete)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    if ((existingCourse as any).authorId !== userId && authReq.user?.role !== 'ADMIN') {
      throw new AppError('Forbidden: You can only delete your own courses', 403);
    }

    await courseService.deleteCourse(id);

    ResponseHandler.success(res, null, 'Course deleted successfully');
  }

  /**
   * Enroll in course
   * POST /api/v1/courses/:id/enroll
   */
  async enrollCourse(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    await courseService.enrollUser(userId, id);

    ResponseHandler.success(res, null, 'Enrolled in course successfully');
  }

  /**
   * Get course progress
   * GET /api/v1/courses/:id/progress
   */
  async getCourseProgress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const progress = await courseService.getCourseProgress(userId, id);

    ResponseHandler.success(res, progress, 'Course progress retrieved successfully');
  }
}

export const courseController = new CourseController();
