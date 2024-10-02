import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFactorConfirmationService {
  constructor(private readonly prisma: PrismaService) {}

  async createByUserId(userId: string) {
    return await this.prisma.twoFactorConfirmation.create({
      data: { userId },
    });
  }

  async getByUserId(userId: string) {
    return await this.prisma.twoFactorConfirmation.findUnique({
      where: { userId },
    });
  }

  async delete(id: string) {
    return await this.prisma.twoFactorConfirmation.delete({
      where: { id },
    });
  }
}
