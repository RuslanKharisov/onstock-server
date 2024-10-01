import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtTokenModule } from '../jwt/jwt.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [JwtTokenModule],
  providers: [SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionModule {}
