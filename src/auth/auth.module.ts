// Главный модуль авторизации

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
// import { YandexAuthStrategy } from './yandex.strategy';
// import { TwoFactorAuthService } from './two-factor.service';
// import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '60m' },
    // }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    // YandexAuthStrategy,
    // JwtStrategy,
    // TwoFactorAuthService,
    // RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
