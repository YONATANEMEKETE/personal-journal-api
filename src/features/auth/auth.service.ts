import { authRepository } from './auth.repository.js';
import { hashPassword, verifyPassword } from '../../shared/utils/password.js';
import { sanitizeUser } from '../../shared/utils/sanitize-user.js';
import { conflict, unauthorized } from '../../shared/errors/error.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

class AuthService {
  async register(data: RegisterInput) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw conflict('A user with this email already exists');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await authRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    return sanitizeUser(user);
  }

  async login(data: LoginInput) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw unauthorized('Invalid email or password');
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw unauthorized('Invalid email or password');
    }

    return sanitizeUser(user);
  }
}

export const authService = new AuthService();
