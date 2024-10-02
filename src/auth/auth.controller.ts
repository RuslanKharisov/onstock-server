import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { VerificationTokenService } from './verificationToken/verification-token.service';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly verificationTokenService: VerificationTokenService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() body: { code?: string }) {
    console.log('🚀 ~ AuthController ~ login ~ body:', body);
    const user = req.user;

    // Если email не подтверждён, возвращаем ошибку
    if (user.error) {
      return { error: user.error };
    }

    // Если двухфакторная аутентификация требуется
    if (user.twoFactor) {
      return { twoFactor: true, success: user.success };
    }

    // Если все проверки пройдены, создаём сессию
    return this.authService.login(req.user);
  }

  @Post('verify-email')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ success?: string; error?: string }> {
    const existingToken = await this.verificationTokenService.findToken(token);

    if (!existingToken) {
      return { error: 'Токен недействителен или истек' };
    }

    // Проверяем, не истек ли токен
    if (new Date() > existingToken.expires) {
      await this.verificationTokenService.deleteToken(token); // Удаляем истекший токен
      return { error: 'Токен истек' };
    }

    // Подтверждаем email
    const existingUser = await this.usersService.findOneByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      return { error: 'Email does not exist!' };
    }

    // Обновляем данные пользователя
    await this.usersService.updateUserEmail(
      existingUser.id,
      existingToken.email,
    );

    // Удаляем токен после успешной верификации
    await this.verificationTokenService.deleteToken(token);

    return { success: 'Email успешно подтвержден' };
  }

  @Post('reset-password')
  async sendResetPasswordLink(@Body('email') email: string) {
    return this.authService.sendResetPasswordLink(email);
  }

  @Post('new-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
