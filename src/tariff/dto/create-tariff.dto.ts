import { IsNumber, IsString } from 'class-validator';

export class CreateTariffDto {
  @IsString()
  name: string;

  @IsNumber()
  maxProducts: number;

  @IsNumber()
  pricePerUnit: number;
}
