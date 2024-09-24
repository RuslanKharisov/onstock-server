import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { JwtTokenService } from './jwt/jwt.service';
import { MailService } from './mail/mail.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtTokenService: JwtTokenService,
    private mailService: MailService,
  ) {}

  /* логика регистрации нового пользователя */

  async register(
    registerDto: RegisterDto,
  ): Promise<{ success?: string; error?: string }> {
    const { name, email, password } = registerDto;

    // Проверка на существование пользователя с таким email
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      return { error: 'Указанный почтовый адрес уже используется!' };
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const newUser: User = await this.usersService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Генерация верификационного токена
    const verificationToken =
      await this.jwtTokenService.generateVerificationToken(email);

    // Отправка email с верификационной ссылкой
    await this.mailService.sendVerificationEmail(
      newUser.email,
      verificationToken,
    );

    return {
      success: 'На указанную почту отправлено письмо для подтверждения!',
    };
  }

  /*  Логика аутентификации зарегистрированного пользователя  */

  /*  Проверка пароля при логине  */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    console.log('🚀 ~ user from db:', user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      payload,
      // access_token: this.jwtService.sign(payload),
    };
  }
}
