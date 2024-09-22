import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';

@Injectable()
export class YandexAuthStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor() {
    super({
      clientID: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/yandex/callback',
      scope: ['email', 'profile'],
    });
  }

  // async validate(accessToken: string, refreshToken: string, profile: any) {
  //   // Логика валидации и создание пользователя
  //   User.findOrCreate({ yandexId: profile.id }, function (err, user) {
  //     return done(err, user);
  //   });
  // }
}
