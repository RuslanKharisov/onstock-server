import { PrismaClient } from '@prisma/client';

const dbClient = new PrismaClient();

const tariffs = [
  { name: 'TARIFF_10', maxProducts: 10, pricePerUnit: 0.0 }, // Бесплатный тариф
  { name: 'TARIFF_100', maxProducts: 100, pricePerUnit: 10.0 },
  { name: 'TARIFF_500', maxProducts: 500, pricePerUnit: 10.0 },
  { name: 'TARIFF_1000', maxProducts: 1000, pricePerUnit: 10.0 },
  { name: 'TARIFF_2500', maxProducts: 2500, pricePerUnit: 10.0 },
  { name: 'TARIFF_5000', maxProducts: 5000, pricePerUnit: 10.0 },
  { name: 'TARIFF_10000', maxProducts: 10000, pricePerUnit: 10.0 },
];

async function seed() {
  // Проверяем, пуста ли таблица
  const count = await dbClient.tariff.count();

  if (count === 0) {
    // Если пуста, заполняем
    await dbClient.tariff.createMany({ data: tariffs });
    console.log('Таблица тарифов была пуста. Данные добавлены.');
  } else {
    // Если не пуста, обновляем записи
    for (const tariff of tariffs) {
      await dbClient.tariff.upsert({
        where: { name: tariff.name },
        update: {
          maxProducts: tariff.maxProducts,
          pricePerUnit: tariff.pricePerUnit,
        },
        create: tariff,
      });
    }
    console.log(
      'Таблица тарифов уже содержала данные. Обновлены существующие записи.',
    );
  }
}

seed()
  .catch((e) => {
    console.error('Ошибка при заполнении данных:', e);
    throw e;
  })
  .finally(async () => {
    await dbClient.$disconnect();
  });
