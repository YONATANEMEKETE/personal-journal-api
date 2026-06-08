type UserWithPassword = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export function sanitizeUser(user: UserWithPassword) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
