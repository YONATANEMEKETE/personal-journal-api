import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.js';
import { requireAuth } from '../../shared/middlewares/require-auth.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { authController } from './auth.controller.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register,
);
authRouter.post('/login', validate(loginSchema, 'body'), authController.login);
authRouter.post('/logout', requireAuth, authController.logout);
authRouter.get('/me', requireAuth, authController.me);
