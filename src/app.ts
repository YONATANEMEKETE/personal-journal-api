import express from 'express';
import { requestLogger } from './shared/middlewares/request-logger.js';

export const app = express();

// NOTE: Middlewares
app.use(requestLogger);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'OK',
  });
});
