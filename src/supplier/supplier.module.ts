import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TariffService } from 'src/tariff/tariff.service';

@Module({
  providers: [SupplierService, TariffService, PrismaService],
  controllers: [SupplierController],
})
export class SupplierModule {}
