import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Генерация токена для верификации email
  async generateVerificationToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  // Генерация токена для сессии пользователя
  async generateSessionToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.configService.get<string>('JWT_SECRET'); // Получаем секрет из env
    return this.jwtService.sign(payload, { secret });
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
      return error;
    }
  }

  async generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
