import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { StockService } from './stock.service';
// import { CreateStockDto } from './dto/create-stock.dto';
// import { UpdateStockDto } from './dto/update-stock.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // @Post()
  // create(@Body() createStockDto: CreateStockDto) {
  //   return this.stockService.create(createStockDto);
  // }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('filters') filters: string,
  ) {
    const parsedFilters = filters ? JSON.parse(filters) : {};
    return await this.stockService.findAll(page, perPage, parsedFilters);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async findOne(
    @Param('id') id: string,
    @Body('page') page: number = 1,
    @Body('perPage') perPage: number = 10,
  ) {
    return await this.stockService.findOne(page, perPage, id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
  //   return this.stockService.update(id, updateStockDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stockService.remove(id);
  }
}
