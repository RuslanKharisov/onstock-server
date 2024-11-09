import { Module } from '@nestjs/common';
import { ProductManagementService } from './product-management.service';
import { ProductManagementController } from './product-management.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TariffModule } from 'src/tariff/tariff.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { ProductModule } from 'src/product/product.module';
import { StockModule } from 'src/stock/stock.module';
import { ProductService } from 'src/product/product.service';
import { StockService } from 'src/stock/stock.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    PrismaModule,
    TariffModule,
    SupplierModule,
    ProductModule,
    StockModule,
  ],
  controllers: [ProductManagementController],
  providers: [
    ProductManagementService,
    ProductService,
    StockService,
    PrismaService,
  ],
})
export class ProductManagementModule {}
