import { IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  id: string;
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
