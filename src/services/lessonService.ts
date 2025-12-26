import { Lesson } from '@prisma/client';
import { BaseService } from './BaseService';
import prisma from '@config/database';
import { AppError } from '@middlewares/errorHandler';

/**
 * Lesson Service
 */
export class LessonService extends BaseService<Lesson> {
  constructor() {
    super('lesson');
  }

  /**
   * Get all lessons in a course
   */
  async getLessonsByCourse(courseId: string, userId?: string): Promise<Lesson[]> {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const lessons = await this.model.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // If user is provided, add completion status
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lessonsWithProgress = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
        lessons.map(async (lesson: any) => {
          const progress = await prisma.progress.findFirst({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            where: { userId, lessonId: lesson.id },
          });

          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...lesson,
            isCompleted: progress?.isCompleted || false,
            progressId: progress?.id,
          };
        })
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return lessonsWithProgress;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return lessons;
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(id: string, userId?: string): Promise<Lesson | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const lesson = await this.model.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    });

    if (!lesson) {
      return null;
    }

    // If user is provided, add completion status
    if (userId) {
      const progress = await prisma.progress.findFirst({
        where: { userId, lessonId: id },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      lesson.isCompleted = progress?.isCompleted || false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      lesson.progressId = progress?.id;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return lesson;
  }

  /**
   * Create new lesson
   */
  async createLesson(data: {
    title: string;
    content: string;
    order: number;
    courseId: string;
    duration?: number;
  }): Promise<Lesson> {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if order already exists
    const existingLesson = await this.findOne({
      courseId: data.courseId,
      order: data.order,
    });

    if (existingLesson) {
      throw new AppError('Lesson with this order already exists in the course', 400);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.create(data);
  }

  /**
   * Update lesson
   */
  async updateLesson(
    id: string,
    data: {
      title?: string;
      content?: string;
      order?: number;
      duration?: number;
    }
  ): Promise<Lesson> {
    const lesson = await this.findById(id);
    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    // If order is being updated, check for conflicts
    if (data.order !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingLesson = await this.findOne({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        courseId: (lesson as any).courseId,
        order: data.order,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if (existingLesson && (existingLesson as any).id !== id) {
        throw new AppError('Lesson with this order already exists in the course', 400);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.update(id, data);
  }

  /**
   * Delete lesson
   */
  async deleteLesson(id: string): Promise<Lesson> {
    const lesson = await this.findById(id);
    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.delete(id);
  }

  /**
   * Mark lesson as complete
   */
  async completeLesson(userId: string, lessonId: string): Promise<void> {
    const lesson = await this.findById(lessonId);
    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    // Check if user is enrolled in the course
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          courseId: (lesson as any).courseId,
        },
      },
    });

    if (!enrollment) {
      throw new AppError('Not enrolled in this course', 403);
    }

    // Check if already completed
    const existingProgress = await prisma.progress.findFirst({
      where: { userId, lessonId },
    });

    if (existingProgress) {
      // Update completion
      await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          isCompleted: true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new progress record
      await prisma.progress.create({
        data: {
          userId,
          lessonId,
          isCompleted: true,
        },
      });
    }

    // Update enrollment lastAccessAt
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          courseId: (lesson as any).courseId,
        },
      },
      data: {
        lastAccessAt: new Date(),
      },
    });

    // Check if all lessons in the course are completed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const allLessons = await prisma.lesson.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { courseId: (lesson as any).courseId },
    });

    const completedLessons = await prisma.progress.count({
      where: {
        userId,
        lesson: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          courseId: (lesson as any).courseId,
        },
        isCompleted: true,
      },
    });

    // If all lessons completed, mark course as completed
    if (completedLessons === allLessons.length) {
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            courseId: (lesson as any).courseId,
          },
        },
        data: {
          completedAt: new Date(),
        },
      });
    }
  }
}

export const lessonService = new LessonService();
