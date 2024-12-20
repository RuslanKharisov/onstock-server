import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<User> {
    const code = req.body.code;
    console.log(
      '🚀 ~ LocalStrategy ~ validate ~ validate:',
      email,
      password,
      code,
    );

    const user = await this.authService.validateUser(email, password, code);

    if (!user || user.error) {
      throw new UnauthorizedException(
        user ? user.error : 'Неверные учетные данные',
      );
    }

    return user;
  }
}
