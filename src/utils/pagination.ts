import { Request } from 'express';
import { PAGINATION } from '../config/constants';
import { PaginationParams } from '../types';

/**
 * Parse pagination parameters từ query string
 */
export const getPaginationParams = (req: Request): PaginationParams => {
  const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  return {
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    sortBy,
    sortOrder,
  };
};

/**
 * Tính skip value cho Prisma
 */
export const getSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Tính metadata cho pagination response
 */
export const getPaginationMeta = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};
