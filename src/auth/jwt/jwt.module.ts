import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtTokenService], // Регистрируем JwtTokenService как провайдер
  exports: [JwtTokenService], // Экспортируем сервис для использования в других модулях, если нужно
})
export class JwtTokenModule {}
