import type { Request, Response, NextFunction } from 'express';
import { entryService } from './entry.service.js';
import { sendSuccessResponse } from '../../shared/utils/response.js';

export class EntryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const entry = await entryService.create(data, req.user!.id);

      req.log.info({ entryId: entry.id }, 'entry created');

      sendSuccessResponse(res, 201, entry);
    } catch (error) {
      next(error);
    }
  }
}

export const entryController = new EntryController();