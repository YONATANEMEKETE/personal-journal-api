import { authRepository } from './auth.repository.js';
import { hashPassword } from '../../shared/utils/password.js';
import { sanitizeUser } from '../../shared/utils/sanitize-user.js';
import { conflict } from '../../shared/errors/error.js';
import type { RegisterInput } from './auth.schema.js';

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
}

export const authService = new AuthService();
