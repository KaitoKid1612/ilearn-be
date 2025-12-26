// Application configuration constants
export const APP_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_VERSION: 'v1',
  API_PREFIX: '/api',
} as const;

// JWT configuration
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

// Database configuration
export const DB_CONFIG = {
  URL: process.env.DATABASE_URL || '',
  POOL_MIN: parseInt(process.env.DB_POOL_MIN || '2'),
  POOL_MAX: parseInt(process.env.DB_POOL_MAX || '10'),
} as const;

// CORS configuration
export const CORS_CONFIG = {
  ORIGIN: process.env.CORS_ORIGIN || '*',
  CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// AI Configuration (for future integration)
export const AI_CONFIG = {
  PROVIDER: process.env.AI_PROVIDER || 'openai',
  API_KEY: process.env.AI_API_KEY || '',
  MODEL: process.env.AI_MODEL || 'gpt-3.5-turbo',
  MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS || '2000'),
} as const;

// Rate limiting
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;

// File upload limits
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
} as const;

// Learning content types
export const CONTENT_TYPES = {
  LESSON: 'lesson',
  FLASHCARD: 'flashcard',
  QUIZ: 'quiz',
  TEST: 'test',
  GAME: 'game',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Response messages
export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Data fetched successfully',
  },
  ERROR: {
    INTERNAL_SERVER: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    BAD_REQUEST: 'Bad request',
    VALIDATION_ERROR: 'Validation error',
  },
} as const;
