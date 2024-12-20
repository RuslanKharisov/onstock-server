import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  password: string | null;

  @IsString()
  provider?: string;

  @IsOptional()
  providerAccountId?: string;

  @IsString()
  type: string;

  @IsOptional()
  image?: string;
}
