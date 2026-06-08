import type { Request, Response, NextFunction } from 'express';
import { entryTagService } from './entrytag.service.js';
import { sendSuccessResponse } from '../../shared/utils/response.js';

export class EntryTagController {
  async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const entryId = req.params.entryId as string;
      const { tagIds } = req.body;
      const entry = await entryTagService.assignTags(entryId, tagIds, req.user!.id);

      req.log.info({ entryId, tagCount: tagIds.length }, 'tags assigned to entry');

      sendSuccessResponse(res, 200, entry);
    } catch (error) {
      next(error);
    }
  }

  async removeTag(req: Request, res: Response, next: NextFunction) {
    try {
      const entryId = req.params.entryId as string;
      const tagId = req.params.tagId as string;
      await entryTagService.removeTag(entryId, tagId, req.user!.id);

      req.log.info({ entryId, tagId }, 'tag removed from entry');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const entryTagController = new EntryTagController();