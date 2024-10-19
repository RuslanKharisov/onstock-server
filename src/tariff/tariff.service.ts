import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTariffDto } from './dto/create-tariff.dto';

@Injectable()
export class TariffService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTariffDto) {
    return await this.prisma.tariff.create({
      data: {
        ...data,
      },
    });
  }

  async findOne(tariffId: number) {
    return this.prisma.tariff.findUnique({
      where: {
        id: tariffId,
      },
    });
  }
}
