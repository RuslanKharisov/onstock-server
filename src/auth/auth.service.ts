import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly mailService: MailService,
    private readonly sessionServise: SessionService,
    private readonly verificationTokenService: VerificationTokenService,
    private twoFactorTokenService: TwoFactorTokenService,
    private twoFactorConfirmationService: TwoFactorConfirmationService,
  ) {}

  /** Регистрация пользователя */
  async register(
    registerDto: RegisterDto,
  ): Promise<{ success?: string; error?: string }> {
    const { name, email, password } = registerDto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      return { error: 'Указанный почтовый адрес уже используется!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const verificationToken =
      await this.jwtTokenService.generateVerificationToken(email);

    // Сохранение токена в базу данных
    await this.verificationTokenService.createToken({
      token: verificationToken,
      email,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // токен истекает через 24 часа
    });

    const confirmLink = `${process.env.RESEND_CONFIRM_URL}/verify-email?token=${verificationToken}`;

    await this.mailService.sendEmailConfifirmationLink(
      newUser.email,
      confirmLink,
    );

    return {
      success: 'На указанную почту отправлено письмо для подтверждения!',
    };
  }

  /*  Проверка пароля при логине  */
  async validateUser(
    email: string,
    password: string,
    code?: string,
  ): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    console.log(code);
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
      return null; // Если пароль неверный
    }
    return user;
  }

  /* Логика логина и создания сессии */
  async login(user: User) {
    console.log('🚀 ~ AuthService ~ login ~ user:', user);
    // Создание новой сессии
    const sessionToken = await this.sessionServise.createSession(
      user.id,
      user.email,
    );

    return {
      sessionToken, // Возвращаем токен сессии на клиент
    };
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
    newPassword: string,
  ): Promise<{ success?: string; error?: string }> {
    // Валидация токена
    const payload = await this.jwtTokenService.verifyResetToken(token);
    if (!payload) {
      return { error: 'Неверный или просроченный токен' };
    }

    const { sub: userId } = payload;

    // Хэширование нового пароля
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновление пароля в базе данных
    await this.usersService.updateUserPasword(userId, hashedPassword);

    return { success: 'Пароль успешно изменён' };
  }
}
