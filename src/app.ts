import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { requestLogger } from './shared/middlewares/request-logger.js';
import { notFound } from './shared/errors/error.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { configs } from './shared/configs/env.js';
import { sessionPool } from './shared/db/session-pool.js';
import helmet from 'helmet';
import cors from 'cors';

const PgSession = connectPgSimple(session);

export const app = express();

// NOTE: Middlewares
app.use(requestLogger);
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

app.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'OK',
  });
});

app.use(notFound);
app.use(errorHandler);
