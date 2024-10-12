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
import { TwoFactorConfirmationService } from './two-factor-confirmation.service';
import { TwoFactorTokenService } from './two-factor-token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    VerificationTokenModule,
    SessionModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    JwtTokenService,
    MailService,
    TwoFactorConfirmationService,
    TwoFactorTokenService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
