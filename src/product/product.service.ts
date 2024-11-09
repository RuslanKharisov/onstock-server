import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto) {
    return 'This action adds a new product';
  }

  updateProductStockQuantity(productId: number, quantity: number) {
    return `обновление количества на складе.`;
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany();
      return products;
    } catch {
      return [];
    }
  }

  findProductBySku(sku: string) {
    return `This action returns a #${sku} product`;
  }

  update(id: number, data: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      console.log('deleting');
      await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    }
  }
}
