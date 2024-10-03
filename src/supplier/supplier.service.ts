import { Injectable } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async createSupplier(values: CreateSupplierCmd, userId: string) {
    try {
      const defaultTariff = await this.prisma.tariff.findUnique({
        where: { name: 'TARIFF_10' },
      });

      if (!defaultTariff) {
        return { error: true, message: 'Default tariff not found' };
      }

      const supplier = await this.prisma.supplier.findUnique({
        where: { userId },
      });

      if (supplier) {
        return { error: true, message: 'Supplier already exist in DB' };
      }

      await this.prisma.supplier.create({
        data: {
          name: values.name,
          email: values.email,
          siteUrl: values.siteUrl,
          userId: userId,
          tariffId: defaultTariff.id,
          subscriptions: {
            create: {
              tariffId: defaultTariff.id,
              startDate: new Date(),
              endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ),
            },
          },
        },
      });
      return { success: true, message: 'Supplier created successfully' };
    } catch (error) {
      console.error('Error creating supplier:', error.message);
      return {
        error: true,
        message: 'Failed to create supplier: ' + error.message,
      };
    }
  }

  async updateSupplier(values: Partial<Supplier>, supplierId: number) {
    return await this.prisma.supplier.update({
      where: { id: supplierId },
      data: { ...values },
    });
  }

  async deleteSupplier(userId: string) {
    // Проверяем наличие поставщика
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      return { error: true, message: 'Supplier not found' };
    }

    // Удаляем поставщика
    await this.prisma.supplier.delete({
      where: { userId: userId },
    });

    return { success: true, message: 'Supplier deleted successfully' };
  }

  async getSupplierByUserId(userId: string) {
    return await this.prisma.supplier.findUnique({
      where: { userId },
    });
  }

  async updateSupplierTariff(supplierId: number, newTariffName: string) {
    const newTariff = await this.prisma.tariff.findUnique({
      where: { name: newTariffName },
    });

    if (!newTariff) {
      throw new Error('New tariff not found');
    }

    return await this.prisma.supplier.update({
      where: { id: supplierId },
      data: {
        tariffId: newTariff.id,
        subscriptions: {
          create: {
            tariffId: newTariff.id,
            startDate: new Date(),
            endDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1),
            ),
          },
        },
      },
    });
  }
}
