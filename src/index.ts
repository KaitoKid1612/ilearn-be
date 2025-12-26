import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { APP_CONFIG, CORS_CONFIG } from '@config/constants';
import { logger } from '@utils/logger';
import { errorHandler, notFoundHandler } from '@middlewares/errorHandler';
import routes from '@routes/index';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: CORS_CONFIG.ORIGIN.split(','),
    credentials: CORS_CONFIG.CREDENTIALS,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.http(message.trim());
      },
    },
  })
);

// API Routes
app.use(`${APP_CONFIG.API_PREFIX}/${APP_CONFIG.API_VERSION}`, routes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'iLearn API',
    version: APP_CONFIG.API_VERSION,
    status: 'running',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const PORT = APP_CONFIG.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📝 Environment: ${APP_CONFIG.NODE_ENV}`);
  logger.info(
    `🔗 API URL: http://localhost:${PORT}${APP_CONFIG.API_PREFIX}/${APP_CONFIG.API_VERSION}`
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
