import { Controller, Get } from '@nestjs/common';
import { TariffService } from './tariff.service';

@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  @Get()
  async findAll() {
    return '<h1>List of all Tariffs</h1>';
  }
}
