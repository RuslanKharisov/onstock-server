import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
