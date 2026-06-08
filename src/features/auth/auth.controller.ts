import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccessResponse } from '../../shared/utils/response.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await authService.register(data);

      req.log.info({ userId: user.id }, 'user registered');
      req.session.userId = user.id;

      sendSuccessResponse(res, 201, user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await authService.login(data);

      req.log.info({ userId: user.id }, 'user logged in');
      req.session.userId = user.id;

      sendSuccessResponse(res, 200, user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
