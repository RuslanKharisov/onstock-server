import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [],
  providers: [TariffService, PrismaService],
})
export class TariffModule {}
