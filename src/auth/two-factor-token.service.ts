import { Injectable } from '@nestjs/common';
import { TwoFactorToken } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFactorTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: string): Promise<TwoFactorToken | null> {
    return await this.prisma.twoFactorToken.findFirst({
      where: { email },
    });
  }

  async delete(id: string) {
    await this.prisma.twoFactorToken.delete({
      where: { id },
    });
  }

  async create(email: string, token: string) {
    return await this.prisma.twoFactorToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 5), // время жизни токена 5 минут
      },
    });
  }
}
