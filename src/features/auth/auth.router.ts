import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { authController } from './auth.controller.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register,
);
// Login
authRouter.post('/login', validate(loginSchema, 'body'), authController.login);
