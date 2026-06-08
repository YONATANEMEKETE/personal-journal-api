import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.js';
import { requireAuth } from '../../shared/middlewares/require-auth.js';
import { createEntrySchema, entryIdParamsSchema } from './entry.schema.js';
import { entryController } from './entry.controller.js';

export const entryRouter = Router();

entryRouter.use(requireAuth);

entryRouter.post(
  '/',
  validate(createEntrySchema, 'body'),
  entryController.create,
);
entryRouter.get(
  '/:entryId',
  validate(entryIdParamsSchema, 'params'),
  entryController.getEntry,
);
