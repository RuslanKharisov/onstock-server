import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';

@Module({
  imports: [],
  providers: [JwtTokenService], // Регистрируем JwtTokenService как провайдер
  exports: [JwtTokenService], // Экспортируем сервис для использования в других модулях, если нужно
})
export class AuthModule {}
