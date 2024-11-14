import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionService } from 'src/auth/session/session.service';
import { JwtTokenModule } from 'src/auth/jwt/jwt.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtTokenModule],
  providers: [UsersService, SessionService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
