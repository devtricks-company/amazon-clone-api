import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { ProductService } from './product.service';
//http://localhost:5000/product
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  findAllProduct(): Promise<ProductDocument[]> {
    return this.productService.findAllProduct();
  }

  @Get(':id')
  findProduct(@Param('id') id: string): Promise<ProductDocument> {
    return this.productService.findProduct(id);
  }

  @Post()
  createProduct(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ): Promise<ProductDocument> {
    return this.productService.createNewProduct(name, price, description);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ): Promise<ProductDocument> {
    return this.productService.updateProduct(id, name, price, description);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
