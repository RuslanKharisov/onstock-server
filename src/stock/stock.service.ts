import { Injectable } from '@nestjs/common';
// import { CreateStockDto } from './dto/create-stock.dto';
// import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedOutputDto } from './dto/paginated-out-dto';
import { StockListElementWithRelations } from 'src/types/types';
import { createPaginator } from 'prisma-pagination';
import { Prisma } from '@prisma/client';
import { Filter } from './entities/filter.entity';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // create(createStockDto: CreateStockDto) {
  //   return 'This action adds a new stock';
  // }

  /** Возвращает все существующие склады */
  async findAll(
    page: number,
    perPage: number,
    filters: Record<string, any> = [],
  ): Promise<PaginatedOutputDto<StockListElementWithRelations>> {
    // Создаём объект where для запроса
    const where: Prisma.StockWhereInput = {};

    // Применяем фильтры
    filters.forEach((filter: Filter) => {
      if (filter.id === 'description') {
        where.product = {
          description: {
            contains: filter.value, // Поиск по описанию
            mode: 'insensitive', // Нечувствительность к регистру
          },
        };
      }
      if (filter.id === 'sku') {
        where.product = {
          sku: {
            contains: filter.value, // Поиск по артикулу
            mode: 'insensitive', // Нечувствительность к регистру
          },
        };
      }
    });
    const paginate = createPaginator({ perPage });

    return paginate(
      this.prisma.stock,
      {
        where,
        include: {
          product: true,
          supplier: true,
        },
        /** Сортировка. Количество по убыванию. */
        orderBy: {
          quantity: 'desc',
        },
      },
      {
        page,
      },
    );
  }

  /* Возвращает склад принадлежащий поставщику */
  async findOne(
    page: number,
    perPage: number,
    id: string,
    filters: Record<string, any> = [],
  ): Promise<PaginatedOutputDto<StockListElementWithRelations>> {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        userId: id,
      },
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    console.log('🚀 ~ StockService ~ filters:', filters);
    // Создаём объект where для запроса
    const where: Prisma.StockWhereInput = { supplierId: supplier.id };

    // Применяем фильтры
    filters.forEach((filter: Filter) => {
      if (filter.id === 'description') {
        where.product = {
          description: {
            contains: filter.value, // Поиск по описанию
            mode: 'insensitive', // Нечувствительность к регистру
          },
        };
      }
      if (filter.id === 'sku') {
        where.product = {
          sku: {
            contains: filter.value, // Поиск по артикулу
            mode: 'insensitive', // Нечувствительность к регистру
          },
        };
      }
    });

    const paginate = createPaginator({ perPage });
    return paginate(
      this.prisma.stock,
      {
        where,
        include: {
          product: true,
          supplier: true,
        },
        /** Сортировка. Количество по убыванию. */
        orderBy: {
          quantity: 'desc',
        },
      },
      {
        page,
      },
    );
  }

  // update(id: string, updateStockDto: UpdateStockDto) {
  //   return `This action updates a #${id} stock`;
  // }

  async remove(stockId: string) {
    console.log('🚀 ~ StockService ~ remove ~ stockId:', stockId);
    try {
      await this.prisma.stock.delete({
        where: { id: stockId },
      });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    }
  }
}

// if (supplier) {
//     const stocks = await this.prisma.stock.findMany({
//       where: {
//         supplierId: supplier?.id,
//       },
//       include: {
//         product: true,
//         supplier: true,
//       },
//     });
//     return stocks;
//   }
