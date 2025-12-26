import { Request, Response, NextFunction } from 'express';

// Custom Request with user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// API Response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Pagination params
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Controller type
export type Controller = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Middleware type
export type Middleware = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
