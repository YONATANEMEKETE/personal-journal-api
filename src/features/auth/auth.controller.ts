import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccessResponse } from '../../shared/utils/response.js';
import { logger } from '../../shared/utils/logger.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await authService.register(data);

      logger.info({ userId: user.id }, 'user registered');
      req.session.userId = user.id;

      sendSuccessResponse(res, 201, user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
