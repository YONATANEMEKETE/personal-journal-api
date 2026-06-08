import { prisma } from '../db/prisma.js';
import type { Request, Response, NextFunction } from 'express';

type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

declare module 'express' {
  interface Request {
    user?: SafeUser;
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export async function deserializeUser(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const userId = req.session.userId;
  if (!userId) {
    return next();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    req.session.destroy(() => {});
    return next();
  }

  req.user = user;
  next();
}
