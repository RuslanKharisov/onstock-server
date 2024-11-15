import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Filter } from '../entities/filter.entity';

export class StockQueryDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  perPage: number;

  @IsOptional()
  @IsString()
  filters: Filter;
}
