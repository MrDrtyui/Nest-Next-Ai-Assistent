import { IsString } from 'class-validator';

export class ImageDto {
  id: number;

  @IsString()
  url: string;

  productId: number;
}
