import { IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  supplierId: number;

  @IsString()
  email?: string;
}
