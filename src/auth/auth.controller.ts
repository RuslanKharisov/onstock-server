import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Query,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { VerificationTokenService } from './verificationToken/verification-token.service';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { SessionService } from './session/session.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterOauthDto } from './dto/register-oauth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly verificationTokenService: VerificationTokenService,
    private usersService: UsersService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('oauth')
  async registerOauth(@Body() dto: RegisterOauthDto) {
    const res = await this.authService.registerOauth(dto);
    return res;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const user = req.user;
    // Если email не подтверждён, возвращаем ошибку
    if (user.error) {
      return { error: user.error };
    }

    // Если двухфакторная аутентификация требуется
    if (user.twoFactor) {
      return {
        twoFactor: true,
        success: 'Двухфакторная аутентификация требуется',
      };
    }

    // Если все проверки пройдены, создаём сессию
    const session = await this.authService.login(req.user);
    return { ...session };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const refresh = await this.sessionService.refreshSession(req.user);
    return { ...refresh };
  }

  @Post('verify-email')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ success?: string; error?: string }> {
    return this.authService.verifyEmailByToken(token);
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

  @Post('verify-session')
  async verifySession(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    // Извлечение токена из заголовка
    const sessionToken = authHeader && authHeader.split(' ')[1];

    const isValid = await this.authService.verifySession(sessionToken);
    if (!isValid) {
      throw new UnauthorizedException('Сессия недействительна');
    }
    return { success: true };
  }
}
