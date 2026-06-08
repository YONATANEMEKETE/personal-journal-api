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

  async getEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const entryId = req.params.entryId as string;
      const entry = await entryService.getEntry(entryId, req.user!.id);

      req.log.info({ entryId: entry.id }, 'entry retrieved');

      sendSuccessResponse(res, 200, entry);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const entryId = req.params.entryId as string;
      const data = req.body;
      const entry = await entryService.updateEntry(entryId, data, req.user!.id);

      req.log.info({ entryId: entry.id }, 'entry updated');

      sendSuccessResponse(res, 200, entry);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const entryId = req.params.entryId as string;
      await entryService.deleteEntry(entryId, req.user!.id);

      req.log.info({ entryId }, 'entry deleted');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const result = await entryService.listEntries(req.user!.id, query);

      req.log.info({ page: query.page, limit: query.limit }, 'entries listed');

      sendSuccessResponse(res, 200, result.items, result.meta);
    } catch (error) {
      next(error);
    }
  }
}

export const entryController = new EntryController();