import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerificationTokenService {
  constructor(private readonly prisma: PrismaService) {} // предполагается использование Prisma

  async createToken(data: { token: string; email: string; expires: Date }) {
    // Удаление старого токена, если он существует
    await this.prisma.verificationToken.deleteMany({
      where: { email: data.email },
    });

    // Создание нового токена
    return this.prisma.verificationToken.create({
      data,
    });
  }

  async findToken(token: string) {
    return this.prisma.verificationToken.findUnique({
      where: { token: token },
    });
  }

  async deleteToken(token: string) {
    this.prisma.verificationToken.delete({
      where: { token },
    });
  }
}
