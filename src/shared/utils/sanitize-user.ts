import type { User } from '../../generated/prisma/client.js';

export function sanitizeUser(user: User) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
