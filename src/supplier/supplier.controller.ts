import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Supplier } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('supplier')
@UseGuards(JwtAuthGuard)
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post()
  async createSupplier(
    @Body() values: CreateSupplierCmd,
    @Req() req: Request & { user: JwtPayload },
  ) {
    const userId = req.user.userId;
    const result = await this.supplierService.createSupplier(values, userId);
    if (result.success) {
      return { message: result.message };
    } else {
      return { message: result.message };
    }
  }

  @Patch(':id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() values: Partial<Supplier>,
  ) {
    return await this.supplierService.updateSupplier(values, parseInt(id));
  }

  @Get('user/:userId')
  async getSupplierByUserId(@Param('userId') userId: string) {
    return await this.supplierService.getSupplierByUserId(userId);
  }

  @Patch(':id/tariff')
  async updateSupplierTariff(
    @Param('id') id: string,
    @Body('newTariffName') newTariffName: string,
  ) {
    return await this.supplierService.updateSupplierTariff(
      parseInt(id),
      newTariffName,
    );
  }

  @Delete()
  async deleteSupplier(@Req() req: Request & { user: JwtPayload }) {
    const userId = req.user.userId;
    console.log('🚀 ~ SupplierController ~ deleteSupplier ~ userId:', userId);
    const result = await this.supplierService.deleteSupplier(userId);

    if (result.success) {
      return { message: result.message };
    } else {
      return { message: result.message };
    }
  }
}
