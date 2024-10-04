import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { Profile } from 'src/types/types';
import * as bcrypt from 'bcryptjs';

export type Role = 'ADMIN' | 'SUPPLIER' | 'USER';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        // Остальные поля будут заполнены значениями по умолчанию или null
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: { email },
      });
    } catch {
      return null;
    }
  }

  async updateUser(
    values: Partial<Profile>,
    userId: string,
  ): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...values,
      },
    });
  }

  async updateUserEmail(id: string, email: string) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        emailVerified: new Date(),
        email: email,
      },
    });
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<{ success?: string; error?: string }> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
      return { success: 'Пароль успешно изменен' };
    } catch (error) {
      console.error('Error creating supplier:', error.message);
      return { error: 'Ошибка при изменении пароля' };
    }
  }
}
