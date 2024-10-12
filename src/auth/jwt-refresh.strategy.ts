import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      // Извлекаем токен из заголовка, но с использованием "Refresh" вместо "Bearer"
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Refresh'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET, // Используем секрет для валидации refresh токена
      passReqToCallback: true, // Передаем запрос в метод validate, если нужно доп. обработать запрос
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Refresh ', ''); // Извлекаем refresh токен из заголовка
    if (!payload || !refreshToken) {
      throw new UnauthorizedException();
    }

    // Возвращаем данные пользователя и сам токен, если потребуется для дальнейших операций
    return { user: payload };
  }
}
