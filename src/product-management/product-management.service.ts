import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { StockService } from 'src/stock/stock.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { AddProductDto } from './dto/add-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductManagementService {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private prisma: PrismaService,
  ) {}

  async addOrUpdateProduct(
    data: AddProductDto,
    userId: string,
  ): Promise<{ success?: string; error?: string }> {
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: { userId: userId },
        include: { tariff: true, subscriptions: true },
      });

      if (!supplier) {
        return { error: 'Поставщик не найден' };
      }

      const currentSubscription = supplier.subscriptions.find(
        (subscription) => {
          const now = new Date();
          return subscription.startDate <= now && subscription.endDate >= now;
        },
      );

      if (!currentSubscription) {
        return { error: 'Нет активной подписки' };
      }

      // Проверяем лимит уникальных SKU в зависимости от тарифа
      const currentProductsCount = await this.prisma.stock.count({
        where: { supplierId: Number(data.supplierId) },
      });

      if (
        supplier.tariff &&
        currentProductsCount >= supplier.tariff.maxProducts
      ) {
        return {
          error: `Достигнут лимит в ${supplier.tariff?.maxProducts} уникальных товаров для этого тарифа`,
        };
      }

      // получение продукта по sku
      const existingProduct = await this.prisma.product.findUnique({
        where: {
          sku: data.sku,
        },
      });
      // получение склада по id поставщика
      const isProductExistInSupplierStock = await this.prisma.stock.findFirst({
        where: {
          productId: existingProduct?.id,
          supplierId: Number(data.supplierId),
        },
      });
      // если товар в базе данных существует
      if (existingProduct) {
        if (isProductExistInSupplierStock?.id) {
          await this.prisma.stock.update({
            where: {
              id: isProductExistInSupplierStock.id,
              // productId: existingProduct?.id,
            },
            data: {
              quantity: Number(data.quantity),
            },
          });
        } else {
          await this.prisma.stock.create({
            data: {
              productId: existingProduct.id,
              supplierId: Number(data.supplierId),
              quantity: Number(data.quantity),
            },
          });
        }
      } else {
        // Если продукт не существует, создаем новый продукт
        await this.prisma.product.create({
          data: {
            sku: data.sku,
            name: data.name,
            description: data.description,
            Stock: {
              create: {
                quantity: Number(data.quantity),
                supplier: {
                  connect: { id: Number(data.supplierId) },
                },
              },
            },
          },
          include: {
            Stock: true,
          },
        });
      }
      return { success: 'Продукты успешно добавлены или обновлены' };
    } catch {
      return { error: 'Неизвестная ошибка' };
    }
  }
}
