import { Injectable } from '@nestjs/common';
// import { CreateStockDto } from './dto/create-stock.dto';
// import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedOutputDto } from './dto/paginated-out-dto';
import { StockListElementWithRelations } from 'src/types/types';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // create(createStockDto: CreateStockDto) {
  //   return 'This action adds a new stock';
  // }

  /* Возвращает все существующие склады */
  async findAll(
    page: number,
    perPage: number,
    // categoryId?: number;
    // productId?: string;
  ): Promise<PaginatedOutputDto<StockListElementWithRelations>> {
    {
      const paginate = createPaginator({ perPage });
      return paginate(
        this.prisma.stock,
        {
          where: {},
          include: {
            product: true,
            supplier: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
        {
          page,
        },
      );
    }
  }

  /* Возвращает склад принадлежащий поставщику */
  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        userId: id,
      },
    });
    if (supplier) {
      try {
        const stocks = await this.prisma.stock.findMany({
          where: {
            supplierId: supplier?.id,
          },
          include: {
            product: true,
            supplier: true,
          },
        });
        return stocks;
      } finally {
        await this.prisma.$disconnect();
      }
    } else {
      return [];
    }
  }

  // update(id: string, updateStockDto: UpdateStockDto) {
  //   return `This action updates a #${id} stock`;
  // }

  async remove(stockId: string) {
    try {
      await this.prisma.stock.delete({
        where: { id: stockId },
      });
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
