import { Request, Response } from 'express';
import { lessonService } from '@services/lessonService';
import { courseService } from '@services/courseService';
import { ResponseHandler } from '@utils/responseHandler';
import { AppError } from '@middlewares/errorHandler';
import { AuthRequest } from '@/types';

/**
 * Lesson Controller
 */
export class LessonController {
  /**
   * Get all lessons in a course
   * GET /api/v1/courses/:courseId/lessons
   */
  async getLessonsByCourse(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    const lessons = await lessonService.getLessonsByCourse(courseId, userId);

    ResponseHandler.success(res, lessons, 'Lessons retrieved successfully');
  }

  /**
   * Get lesson by ID
   * GET /api/v1/lessons/:id
   */
  async getLessonById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    const lesson = await lessonService.getLessonById(id, userId);

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    ResponseHandler.success(res, lesson, 'Lesson retrieved successfully');
  }

  /**
   * Create new lesson
   * POST /api/v1/courses/:courseId/lessons
   */
  async createLesson(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Check if course exists and user has permission
    const course = await courseService.findById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is the author or admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((course as any).authorId !== userId && authReq.user?.role !== 'ADMIN') {
      throw new AppError('Forbidden: Only course author can add lessons', 403);
    }

    const { title, content, order, duration } = req.body as {
      title: string;
      content: string;
      order: number;
      duration?: number;
    };

    const lesson = await lessonService.createLesson({
      title,
      content,
      order,
      courseId,
      duration,
    });

    ResponseHandler.success(res, lesson, 'Lesson created successfully', 201);
  }

  /**
   * Update lesson
   * PUT /api/v1/lessons/:id
   */
  async updateLesson(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    // Check if lesson exists
    const existingLesson = await lessonService.findById(id);
    if (!existingLesson) {
      throw new AppError('Lesson not found', 404);
    }

    // Check if user has permission (course author or admin)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const course = await courseService.findById((existingLesson as any).courseId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((course as any).authorId !== userId && authReq.user?.role !== 'ADMIN') {
      throw new AppError('Forbidden: Only course author can update lessons', 403);
    }

    const { title, content, order, duration } = req.body as {
      title?: string;
      content?: string;
      order?: number;
      duration?: number;
    };

    const lesson = await lessonService.updateLesson(id, {
      title,
      content,
      order,
      duration,
    });

    ResponseHandler.success(res, lesson, 'Lesson updated successfully');
  }

  /**
   * Delete lesson
   * DELETE /api/v1/lessons/:id
   */
  async deleteLesson(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    // Check if lesson exists
    const existingLesson = await lessonService.findById(id);
    if (!existingLesson) {
      throw new AppError('Lesson not found', 404);
    }

    // Check if user has permission (course author or admin)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const course = await courseService.findById((existingLesson as any).courseId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((course as any).authorId !== userId && authReq.user?.role !== 'ADMIN') {
      throw new AppError('Forbidden: Only course author can delete lessons', 403);
    }

    await lessonService.deleteLesson(id);

    ResponseHandler.success(res, null, 'Lesson deleted successfully');
  }

  /**
   * Mark lesson as complete
   * POST /api/v1/lessons/:id/complete
   */
  async completeLesson(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    await lessonService.completeLesson(userId, id);

    ResponseHandler.success(res, null, 'Lesson marked as complete');
  }
}

export const lessonController = new LessonController();
