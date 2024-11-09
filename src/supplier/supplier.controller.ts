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
import { CreateSupplierCmd, JwtPayload } from 'src/types/types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Supplier')
@Controller('supplier')
@UseGuards(JwtAuthGuard)
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSupplier(
    @Body() values: CreateSupplierCmd,
    @Req() req: Request & { user: JwtPayload },
  ) {
    const userId = req.user.sub;
    console.log('🚀 ~ SupplierController ~ userId:', userId);
    const result = await this.supplierService.createSupplier(values, userId);
    if (result.success) {
      return { message: result.message };
    } else {
      return { message: result.message };
    }
  }

  @Patch()
  async updateSupplier(
    @Body() values: Partial<Supplier>,
    @Req() req: Request & { user: JwtPayload },
  ) {
    const userId = req.user.sub;
    return await this.supplierService.updateSupplierByUser(values, userId);
  }

  @Get(':userId')
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
    const userId = req.user.sub;
    const result = await this.supplierService.deleteSupplier(userId);
    if (result.success) {
      return { message: result.message };
    } else {
      return { message: result.message };
    }
  }
}
