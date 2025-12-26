import express from 'express';
import { healthCheck } from '@controllers/healthController';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// TODO: Add more routes
// router.use('/courses', courseRoutes);
// router.use('/lessons', lessonRoutes);
// router.use('/flashcards', flashcardRoutes);
// router.use('/quizzes', quizRoutes);
// router.use('/games', gameRoutes);

export default router;
