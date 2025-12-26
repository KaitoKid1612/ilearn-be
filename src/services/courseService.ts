import { Course } from '@prisma/client';
import { BaseService } from './BaseService';
import prisma from '@config/database';
import { AppError } from '@middlewares/errorHandler';

/**
 * Course Service
 */
export class CourseService extends BaseService<Course> {
  constructor() {
    super('course');
  }

  /**
   * Get all courses with filters
   */
  async getCourses(options: {
    skip?: number;
    take?: number;
    userId?: string;
    isPublic?: boolean;
    enrolled?: boolean;
    search?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderBy?: any;
  }): Promise<Course[]> {
    const { skip, take, userId, isPublic, enrolled, search, orderBy } = options;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const where: any = {};

    if (isPublic !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.isPublic = isPublic;
    }

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (enrolled && userId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.enrollments = {
        some: { userId },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.model.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      skip,
      take,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
    });
  }

  /**
   * Get course by ID with full details
   */
  async getCourseById(id: string, userId?: string): Promise<Course | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const course = await this.model.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            duration: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    // Check if user is enrolled
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: id,
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      course.isEnrolled = !!enrollment;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return course;
  }

  /**
   * Create new course
   */
  async createCourse(data: {
    title: string;
    description?: string;
    content: string;
    thumbnail?: string;
    isPublic: boolean;
    authorId: string;
  }): Promise<Course> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.create(data);
  }

  /**
   * Update course
   */
  async updateCourse(
    id: string,
    data: {
      title?: string;
      description?: string;
      content?: string;
      thumbnail?: string;
      isPublic?: boolean;
    }
  ): Promise<Course> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.update(id, data);
  }

  /**
   * Delete course
   */
  async deleteCourse(id: string): Promise<Course> {
    // Check if course exists
    const course = await this.findById(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.delete(id);
  }

  /**
   * Enroll user in course
   */
  async enrollUser(userId: string, courseId: string): Promise<void> {
    // Check if course exists
    const course = await this.findById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new AppError('Already enrolled in this course', 400);
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  /**
   * Get user's progress in a course
   */
  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.findById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new AppError('Not enrolled in this course', 403);
    }

    // Get all lessons
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });

    // Get completed lessons
    const completedProgress = await prisma.progress.findMany({
      where: {
        userId,
        lesson: {
          courseId,
        },
        isCompleted: true,
      },
    });

    const totalLessons = lessons.length;
    const completedLessons = completedProgress.length;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      courseId,
      enrolledAt: enrollment.enrolledAt,
      lastAccessAt: enrollment.lastAccessAt,
      totalLessons,
      completedLessons,
      progressPercentage,
      isCompleted: enrollment.completedAt !== null,
      completedAt: enrollment.completedAt,
    };
  }

  /**
   * Count courses
   */
  async countCourses(options: {
    isPublic?: boolean;
    userId?: string;
    enrolled?: boolean;
    search?: string;
  }): Promise<number> {
    const { isPublic, userId, enrolled, search } = options;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const where: any = {};

    if (isPublic !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.isPublic = isPublic;
    }

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (enrolled && userId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.enrollments = {
        some: { userId },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.count(where);
  }
}

export const courseService = new CourseService();
