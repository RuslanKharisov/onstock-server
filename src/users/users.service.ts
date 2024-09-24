import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

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

  // async findOrCreate(criteria: { yandexId: string }): Promise<User> {
  //   // Попытка найти пользователя по yandexId
  //   let user = await this.prisma.findOne({ where: { yandexId: criteria.yandexId } });

  //   // Если пользователя нет, создаем нового
  //   if (!user) {
  //     user = this.prisma.create({
  //       yandexId: criteria.yandexId,
  //       // Вы можете добавить здесь другие поля, например:
  //       // name: criteria.name,
  //       // email: criteria.email,
  //     });
  //     // Сохраняем нового пользователя в базе данных
  //     user = await this.prisma.save(user);
  //   }

  //   return user;
  // }
}
