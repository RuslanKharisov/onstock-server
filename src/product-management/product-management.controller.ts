import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProductManagementService } from './product-management.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { addOrUpdateProductCommand, JwtPayload } from 'src/types/types';

@Controller('product-management')
export class ProductManagementController {
  constructor(
    private readonly productManagementService: ProductManagementService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addOrUpdateProduct(
    @Body() values: addOrUpdateProductCommand,
    @Req() req: Request & { user: JwtPayload },
  ) {
    const userId = req.user.sub;
    console.log('🚀 ~ ProductManagementController ~ userId:', userId);
    return await this.productManagementService.addOrUpdateProduct(
      values,
      userId,
    );
  }
}
