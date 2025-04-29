import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageDto } from './dto.image-create';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images: CreateImageDto[];
}
