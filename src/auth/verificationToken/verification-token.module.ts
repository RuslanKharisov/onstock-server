import { Module } from '@nestjs/common';
import { VerificationTokenService } from './verification-token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtTokenModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtTokenModule],
  providers: [VerificationTokenService],
  exports: [VerificationTokenService], // Экспортируем сервис для использования в других модулях
})
export class VerificationTokenModule {}
