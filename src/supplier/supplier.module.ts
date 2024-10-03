import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SupplierService, PrismaService],
  controllers: [SupplierController],
})
export class SupplierModule {}
