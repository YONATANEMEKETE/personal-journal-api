import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.js';
import { requireAuth } from '../../shared/middlewares/require-auth.js';
import { createTagSchema, updateTagSchema, listTagsQuerySchema, tagIdParamsSchema } from './tags.schema.js';
import { tagsController } from './tags.controller.js';

export const tagsRouter = Router();

tagsRouter.use(requireAuth);

tagsRouter.get('/', validate(listTagsQuerySchema, 'query'), tagsController.list);
tagsRouter.get('/:tagId', validate(tagIdParamsSchema, 'params'), tagsController.getTag);
tagsRouter.patch('/:tagId', validate(tagIdParamsSchema, 'params'), validate(updateTagSchema, 'body'), tagsController.update);
tagsRouter.delete('/:tagId', validate(tagIdParamsSchema, 'params'), tagsController.delete);
tagsRouter.post('/', validate(createTagSchema, 'body'), tagsController.create);
