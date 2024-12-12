import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtTokenService } from './jwt/jwt.service';
import { MailService } from './mail/mail.service';
import { VerificationTokenService } from './verificationToken/verification-token.service';
import { SessionService } from './session/session.service';
import { TwoFactorTokenService } from './two-factor-token.service';
import { TwoFactorConfirmationService } from './two-factor-confirmation.service';
import { RegisterOauthDto } from './dto/register-oauth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
    private readonly verificationTokenService: VerificationTokenService,
    private twoFactorTokenService: TwoFactorTokenService,
    private twoFactorConfirmationService: TwoFactorConfirmationService,
  ) {}

  /** Регистрация пользователя */
  async register(
    dto: RegisterDto,
  ): Promise<{ success?: string; error?: string }> {
    const { name, email, password, type } = dto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      return { error: 'ВНИМАНИЕ: Адрес уже зарегистрирован!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.createUser({
      name,
      email,
      password: hashedPassword,
      type,
    });

    const verificationToken =
      await this.jwtTokenService.generateVerificationToken(email);

    const existingToken = await this.verificationTokenService.findToken(email);

    if (existingToken) {
      // Валидация токена
      const payload = await this.jwtTokenService.verifyToken(existingToken.id);
      if (!payload) {
        await this.verificationTokenService.deleteToken(existingToken.token);
      }
    }

    // Сохранение токена в базу данных
    await this.verificationTokenService.createToken({
      token: verificationToken,
      email,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 1), // токен истекает через 24 часа
    });

    const confirmLink = `${process.env.RESEND_CONFIRM_URL}/new-verification?token=${verificationToken}`;

    await this.mailService.sendEmailConfifirmationLink(
      newUser.user.email,
      confirmLink,
    );

    return {
      success: 'На указанную почту отправлено письмо для подтверждения!',
    };
  }

  /** Регистрация oauth */
  async registerOauth(dto: RegisterOauthDto) {
    const { email } = dto;
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      return await this.sessionService.createSession(existingUser);
    } else {
      return await this.usersService.createUser(dto);
    }
  }

  /* Верификация почты */

  async verifyEmailByToken(
    token: string,
  ): Promise<{ success?: string; error?: string }> {
    const existingToken = await this.verificationTokenService.findToken(token);
    if (!existingToken) {
      return { error: 'Токен недействителен или истек' };
    }
    // Валидация токена
    const payload = await this.jwtTokenService.verifyToken(token);
    if (!payload) {
      return { error: 'Токен недействителен или истек' };
    }

    // Подтверждаем email
    const existingUser = await this.usersService.findOneByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      return { error: 'Email не найден' };
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

  /*  Проверка пароля при логине  */
  async validateUser(
    email: string,
    password: string,
    code?: string,
  ): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return { error: 'Пользователь с данным Email не зарегистрирован' };
    }

    /* Если email не подтверждён, отправляем письмо с токеном */
    if (!user.emailVerified) {
      const verificationToken =
        await this.jwtTokenService.generateVerificationToken(email);
      await this.verificationTokenService.createToken({
        token: verificationToken,
        email: user.email,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      const confirmLink = `${process.env.RESEND_CONFIRM_URL}/verify-email?token=${verificationToken}`;
      await this.mailService.sendEmailConfifirmationLink(
        user.email,
        confirmLink,
      );

      return { error: 'Email не подтверждён. Письмо отправлено повторно.' };
    }

    // логика в случае активированной 2FA.
    if (user.isTwoFactorEnabled && user.email) {
      if (code) {
        const twoFactorToken = await this.twoFactorTokenService.getByEmail(
          user.email,
        );
        if (!twoFactorToken || twoFactorToken.token !== code) {
          throw new BadRequestException('Код неверный!');
        }

        if (new Date(twoFactorToken.expires) < new Date()) {
          throw new BadRequestException('Истек срок действия кода!');
        }

        await this.twoFactorTokenService.delete(twoFactorToken.id);

        const existingConfirmation =
          await this.twoFactorConfirmationService.getByUserId(user.id);

        if (existingConfirmation) {
          await this.twoFactorConfirmationService.delete(
            existingConfirmation.id,
          );
        }

        await this.twoFactorConfirmationService.createByUserId(user.id);
      } else {
        const existingToken = await this.twoFactorTokenService.getByEmail(
          user.email,
        );

        if (existingToken) {
          await this.twoFactorTokenService.delete(existingToken.id);
        }

        const token = await this.jwtTokenService.generate2FACode();

        const twoFactorToken = await this.twoFactorTokenService.create(
          user.email,
          token.toString(),
        );

        await this.mailService.sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token,
        );
        return {
          twoFactor: true,
          success: 'На указанную почту отправлен 2FA код для входа!',
        };
      }
    }
    /* Проверяем пароль */
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new UnauthorizedException();
    }
    return user;
  }

  /* Логика логина и создания сессии */
  async login(user: User) {
    return await this.sessionService.createSession(user);
  }

  /* Логика для отправки ссылки на сброс пароля */
  async sendResetPasswordLink(
    email: string,
  ): Promise<{ success?: string; error?: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return { error: 'Пользователь с таким email не найден' };
    }

    // Генерация токена для сброса пароля
    const resetToken = await this.jwtTokenService.generateResetToken(
      user.id,
      user.email,
    );

    // Ссылка на страницу сброса пароля
    const resetLink = `${process.env.RESEND_CLIENT_URL}/new-password?token=${resetToken}`;

    // Отправка email с ссылкой на сброс пароля
    await this.mailService.sendResetPasswordLink(user.email, resetLink);

    return { success: 'Ссылка для сброса пароля отправлена на вашу почту' };
  }

  /* Логика для сброса пароля */
  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ success?: string; error?: string }> {
    if (!password) {
      return { error: 'Ошибка чтения пароля' };
    }
    // Валидация токена
    const payload = await this.jwtTokenService.verifyToken(token);
    if (!payload) {
      return { error: 'Неверный или просроченный токен' };
    }

    const { sub: userId } = payload;

    try {
      // Обновление пароля в базе данных
      return this.usersService.updateUserPassword(userId, password);
    } catch (error) {
      console.error(error);
      return { error: 'Ошибка при изменении пароля' };
    }
  }

  async verifySession(sessionToken: string): Promise<boolean> {
    const session = await this.sessionService.findSessionByToken(sessionToken);
    const tokenIsValid = this.jwtTokenService.verifyToken(session.accessToken);
    if (!tokenIsValid) {
      return false;
    }
    return true;
  }
}
