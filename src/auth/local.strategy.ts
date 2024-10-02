import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Используем email вместо username
      passwordField: 'password', // Пароль
      passReqToCallback: true, // Чтобы получить доступ к request
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    const code = req.body.code; // Получаем код из тела запроса

    // Валидируем пользователя и код 2FA
    const user = await this.authService.validateUser(email, password, code);

    if (!user || user.error) {
      throw new UnauthorizedException(
        user ? user.error : 'Неверные учетные данные',
      );
    }

    return user; // Возвращаем пользователя, если все проверки пройдены
  }
}
