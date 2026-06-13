import { app } from './app.js';
import { configs } from './shared/configs/env.js';
import { prisma } from './shared/db/prisma.js';
import { logger } from './shared/utils/logger.js';

let isShuttingDown = false;

// TODO: add startup validation like db-check, other required checks before server starts

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
  logger.info({ event: 'server_healthy' }, 'Server is healthy');
});

app.get('/ready', (_req, res) => {
  if (isShuttingDown) {
    logger.info(
      { event: 'server_not_ready' },
      'Server is shutting down, and not accepting HTTP requests',
    );
    return res.status(503).json({
      status: 'error',
      code: 'SERVICE_UNAVAILABLE',
      message: 'Server is shutting down',
    });
  }
  res.status(200).json({
    status: 'ok',
  });
  logger.info(
    { event: 'server_ready' },
    'Server is ready, and accepting HTTP requests',
  );
});

const server = app.listen(configs.PORT, () => {
  logger.info(
    `Server is running on port http://localhost:${configs.PORT}, in ${configs.NODE_ENV} mode`,
  );
});

const gracefulShutdown = async () => {
  logger.info('Received kill signal, shutting down gracefully.');
  isShuttingDown = true;

  logger.info('Closing HTTP server');
  server.close(async (err) => {
    if (err) {
      logger.error('Error closing HTTP server: %s', err);
      process.exit(1);
    }
    try {
      logger.info('Closing database connections...');
      await prisma.$disconnect();

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Shutdown failed: %s', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down.',
    );
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown());
process.on('SIGINT', () => gracefulShutdown());
