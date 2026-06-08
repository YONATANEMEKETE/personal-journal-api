import express from 'express';
import { requestLogger } from './shared/middlewares/request-logger.js';
import { notFound } from './shared/errors/error.js';
import { errorHandler } from './shared/middlewares/error-handler.js';

export const app = express();

// NOTE: Middlewares
app.use(requestLogger);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'OK',
  });
});

app.use(notFound);
app.use(errorHandler);
