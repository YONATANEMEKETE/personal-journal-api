import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.js';
import { entryIdParamsSchema, assignTagsBodySchema, deleteEntryTagParamsSchema } from './entrytag.schema.js';
import { entryTagController } from './entrytag.controller.js';

export const entryTagRouter = Router({ mergeParams: true });

entryTagRouter.post(
  '/',
  validate(entryIdParamsSchema, 'params'),
  validate(assignTagsBodySchema, 'body'),
  entryTagController.assign,
);
entryTagRouter.delete(
  '/:tagId',
  validate(deleteEntryTagParamsSchema, 'params'),
  entryTagController.removeTag,
);