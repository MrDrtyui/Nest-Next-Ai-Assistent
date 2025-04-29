import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto.product-create';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: { Image: true },
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { Image: true },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, images } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        Image: {
          create: images.map((image) => ({ url: image.url })),
        },
      },
      include: { Image: true },
    });

    return product;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}
