import express from 'express';
import { requestLogger } from './shared/middlewares/request-logger.js';
import { notFound } from './shared/errors/error.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import helmet from 'helmet';
import cors from 'cors';

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

app.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'OK',
  });
});

app.use(notFound);
app.use(errorHandler);
