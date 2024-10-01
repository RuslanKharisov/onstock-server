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
}
