import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TariffController } from './tariff.controller';

@Module({
  imports: [PrismaModule],
  providers: [TariffService],
  exports: [TariffService],
  controllers: [TariffController],
})
export class TariffModule {}
