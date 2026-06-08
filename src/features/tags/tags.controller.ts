import type { Request, Response, NextFunction } from 'express';
import { tagsService } from './tags.service.js';
import { sendSuccessResponse } from '../../shared/utils/response.js';
import type { ListTagsQuery } from './tags.schema.js';

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
      const query = req.query as unknown as ListTagsQuery;
      const tags = await tagsService.listTags(req.user!.id, query);

      req.log.info({ count: tags.length }, 'tags listed');

      sendSuccessResponse(res, 200, tags);
    } catch (error) {
      next(error);
    }
  }

  async getTag(req: Request, res: Response, next: NextFunction) {
    try {
      const tagId = req.params.tagId as string;
      const tag = await tagsService.getTag(tagId, req.user!.id);

      req.log.info({ tagId: tag.id }, 'tag retrieved');

      sendSuccessResponse(res, 200, tag);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tagId = req.params.tagId as string;
      const data = req.body;
      const tag = await tagsService.updateTag(tagId, data, req.user!.id);

      req.log.info({ tagId: tag.id }, 'tag updated');

      sendSuccessResponse(res, 200, tag);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const tagId = req.params.tagId as string;
      await tagsService.deleteTag(tagId, req.user!.id);

      req.log.info({ tagId }, 'tag deleted');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const tagsController = new TagsController();
