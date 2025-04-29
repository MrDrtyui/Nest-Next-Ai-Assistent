import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductModule {}
