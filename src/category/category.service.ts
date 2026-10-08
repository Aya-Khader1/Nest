import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category, HCategoryDocument } from '../DB/models/category.model.js';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<HCategoryDocument>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    logoUrl: string,
    adminId: Types.ObjectId,
  ) {
    console.log(createCategoryDto);
    const newCategory = new this._categoryModel({
      ...createCategoryDto,
      logo: logoUrl,
      createdBy: adminId,
    });

    return await newCategory.save();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    logoUrl?: string,
  ) {
    const updatedPayLoad: any = { ...updateCategoryDto };
    if (logoUrl) updatedPayLoad.logo = logoUrl;
    const updatedCatergory = await this._categoryModel
      .findByIdAndUpdate(id, updatedPayLoad, { returnDocument: 'after' })
      .populate('createdBy', '-password');
    if (!updatedCatergory) throw new NotFoundException('Catergory nont found');
    return updatedCatergory;
  }

  async findOne(id: Types.ObjectId) {
    const category = await this._categoryModel.findById(id);
    if (!category)
      throw new NotFoundException(`Category with Id ${id} not found`);

    return category;
  }
  async findAll() {
    return await this._categoryModel.find();
  }
  async remove(id: Types.ObjectId) {
    const category = await this._categoryModel.findByIdAndDelete(id);
    if (!category)
      throw new NotFoundException(`Category with Id ${id} not found`);
    return {
      success: true,
      message: 'Deleted Successfully',
    };
  }
}
