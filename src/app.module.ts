import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { SupplierModule } from './supplier/supplier.module';
import { ConfigModule } from '@nestjs/config';
import { TariffModule } from './tariff/tariff.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { ProductManagementModule } from './product-management/product-management.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    SupplierModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TariffModule,
    ProductModule,
    StockModule,
    ProductManagementModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
