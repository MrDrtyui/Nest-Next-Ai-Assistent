import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageDto } from './dto.image';

export class ProductDto {
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  createdAt: Date;

  updatedAt: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
}
