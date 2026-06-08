import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.js';
import { requireAuth } from '../../shared/middlewares/require-auth.js';
import { createTagSchema, listTagsQuerySchema } from './tags.schema.js';
import { tagsController } from './tags.controller.js';

export const tagsRouter = Router();

tagsRouter.use(requireAuth);

tagsRouter.get('/', validate(listTagsQuerySchema, 'query'), tagsController.list);
tagsRouter.post('/', validate(createTagSchema, 'body'), tagsController.create);
