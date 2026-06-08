import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.js';
import { requireAuth } from '../../shared/middlewares/require-auth.js';
import { createTagSchema } from './tags.schema.js';
import { tagsController } from './tags.controller.js';

export const tagsRouter = Router();

tagsRouter.use(requireAuth);

tagsRouter.post('/', validate(createTagSchema, 'body'), tagsController.create);
