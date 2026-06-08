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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie('connect.sid');
        res.status(204).send();
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      sendSuccessResponse(res, 200, req.user!);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
