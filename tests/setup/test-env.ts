import { prisma } from '../../src/shared/db/prisma.js';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "users", "journal_entries", "tags", "user_sessions", "entry_tags" CASCADE;`,
  );
});
