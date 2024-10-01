import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  // Генерация токена для верификации email
  async generateVerificationToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  // Генерация токена для сессии пользователя
  async generateSessionToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  // Генерация токена для сброса пароля
  async generateResetToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, { expiresIn: '1h' }); // Токен действует 1 час
  }

  // Валидация токена для сброса пароля
  async verifyResetToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
