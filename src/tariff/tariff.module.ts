import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TariffService],
  exports: [TariffService],
})
export class TariffModule {}
