import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e) => {
  logger.error(`Prisma Error: ${e.message}`);
});

// Graceful shutdown
process.on('beforeExit', () => {
  void (async () => {
    await prisma.$disconnect();
    logger.info('Prisma disconnected');
  })();
});

export default prisma;
