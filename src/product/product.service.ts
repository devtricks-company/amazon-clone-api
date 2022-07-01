import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAllProduct(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
  }

  async findProduct(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id).exec();
  }

  async createNewProduct(
    name: string,
    price: number,
    description: string,
  ): Promise<ProductDocument> {
    const newProduct = new this.productModel({ name, price, description });
    return newProduct.save();
  }

  async updateProduct(
    id: string,
    name: string,
    price: number,
    description: string,
  ): Promise<ProductDocument> {
    const existProduct = await this.findProduct(id);

    existProduct.name = name ?? existProduct.name;
    existProduct.price = price ?? existProduct.price;
    existProduct.description = description ?? existProduct.description;

    return existProduct.save();
  }

  deleteProduct(id: string) {
    return this.productModel.deleteOne({ _id: id }).exec();
  }
}
