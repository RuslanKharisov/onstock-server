import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtTokenModule } from '../jwt/jwt.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtTokenModule],
  providers: [SessionService, JwtService, PrismaService],
  exports: [SessionService],
})
export class SessionModule {}
