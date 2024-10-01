// Главный модуль авторизации

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtTokenService } from './jwt/jwt.service';
import { MailService } from './mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { VerificationTokenModule } from './verificationToken/verification-token.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    VerificationTokenModule,
    SessionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtTokenService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
