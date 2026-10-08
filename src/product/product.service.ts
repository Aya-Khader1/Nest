import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HProductDocument, Product } from '../DB/models/product.model.js';
import { Brand, HBrandDocument } from '../DB/models/brand.model.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly _productModel: Model<HProductDocument>,
    @InjectModel(Brand.name)
    private readonly _brandModel: Model<HBrandDocument>,
  ) {}
  private async validateBrandCategoryRelationship(
    brandId: string,
    categoryId: string,
  ): Promise<void> {
    const brand = await this._brandModel.findById(brandId);
    if (!brand) throw new NotFoundException('the assigned brand not exists');
    const supportedCategoryIds = brand.categories.map((id) => id.toString());
    if (!supportedCategoryIds.includes(categoryId))
      throw new BadRequestException(
        `Buinuss rule : the brand ${brand.name} does not belong to or support the specific category`,
      );
  }
  async create(
    createProductDto: CreateProductDto,
    imagesUrl: string[],
    adminId: Types.ObjectId,
  ) {
    await this.validateBrandCategoryRelationship(
      createProductDto.brand,
      createProductDto.category,
    );
    console.log('price', typeof createProductDto.price);
    const newProduct = await new this._productModel({
      ...createProductDto,
      images: imagesUrl,
      createdBy: adminId,
    });
    return (await newProduct.save()).populate(
      'brand category createdBy',
      '-password',
    );
  }

  async findAll(): Promise<HProductDocument[]> {
    return await this._productModel
      .find()
      .populate('brand category createdBy', '-password');
  }

  async findOne(id: Types.ObjectId): Promise<HProductDocument> {
    const product = await this._productModel
      .findById(id)
      .populate('brand category createdBy', '-password');
    if (!product) throw new BadRequestException('');
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
