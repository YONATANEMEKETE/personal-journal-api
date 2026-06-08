import type { Request, Response, NextFunction } from 'express';
import { tagsService } from './tags.service.js';
import { sendSuccessResponse } from '../../shared/utils/response.js';

export class TagsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const tag = await tagsService.create(data, req.user!.id);

      req.log.info({ tagId: tag.id, name: tag.name }, 'tag created');

      sendSuccessResponse(res, 201, tag);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const tags = await tagsService.listTags(req.user!.id, query);

      req.log.info({ count: tags.length }, 'tags listed');

      sendSuccessResponse(res, 200, tags);
    } catch (error) {
      next(error);
    }
  }
}

export const tagsController = new TagsController();