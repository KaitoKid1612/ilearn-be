import express from 'express';
import { healthCheck } from '@controllers/healthController';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import courseRoutes from './course.routes';
import lessonRoutes from './lesson.routes';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);

// TODO: Add more routes
// router.use('/flashcards', flashcardRoutes);
// router.use('/quizzes', quizRoutes);
// router.use('/games', gameRoutes);

export default router;
