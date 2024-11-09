import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TariffModule } from 'src/tariff/tariff.module';

@Module({
  imports: [PrismaModule, TariffModule],
  providers: [SupplierService],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
