import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { requestLogger } from './shared/middlewares/request-logger.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { configs } from './shared/configs/env.js';
import { sessionPool } from './shared/db/session-pool.js';
import helmet from 'helmet';
import cors from 'cors';
import { deserializeUser } from './shared/middlewares/deserialize-user.js';
import { authRouter } from './features/auth/auth.router.js';
import { entryRouter } from './features/journal-entries/entry.router.js';
import { tagsRouter } from './features/tags/tags.router.js';
import { notFoundHandler } from './shared/middlewares/not-found.js';
//
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { metricsMiddleware } from './shared/middlewares/metrics.js';
import { logger } from './shared/utils/logger.js';
import { register } from './shared/utils/metrics.js';

const swaggerDocument = YAML.load(path.join(process.cwd(), 'openapi.yaml'));

const PgSession = connectPgSimple(session);

export const app = express();

// NOTE: Middlewares
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(requestLogger);
app.use(metricsMiddleware);
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    credentials: true,
  }),
);
app.use(
  session({
    store: new PgSession({
      pool: sessionPool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: configs.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: configs.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(deserializeUser);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
  logger.info({ event: 'server_healthy' }, 'Server is healthy');
});

app.get('/ready', (req, res) => {
  if (req.app.locals.isShuttingDown) {
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
    status: 'ready',
  });
  logger.info(
    { event: 'server_ready' },
    'Server is ready, and accepting HTTP requests',
  );
});

// NOTE: Prometheus Metrics Endpoint
app.get('/metrics', async (_req, res) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    logger.error('Error generating metrics: %s', err);
    res.status(500).send(err);
  }
});

// NOTE: Routes
app.use('/auth', authRouter);
app.use('/entries', entryRouter);
app.use('/tags', tagsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
