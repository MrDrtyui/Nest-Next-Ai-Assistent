import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto.product-create';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(+id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }
}
