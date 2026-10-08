import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Req,
  BadRequestException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import type { Request } from 'express';
import { Model, Types } from 'mongoose';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/utils/multer.util.js';
import { InjectModel } from '@nestjs/mongoose';
import { Category, HCategoryDocument } from '../DB/models/category.model.js';
import { AdminGuard } from '../common/guards/role.guard.js';
@Controller('category')
export class CategoryController {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<HCategoryDocument>,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    if (!file) throw new BadRequestException('Category Logo is required');
    const logoUrl = `http://127.0.0.1${file.path.replace(/\\/g, '/')}`;
    const adminId = req.user!._id as unknown as Types.ObjectId;
    return this.categoryService.create(createCategoryDto, logoUrl, adminId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @UploadedFile() file: Express.Multer.File,

    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    let logoUrl: string | undefined;
    if (file) {
      logoUrl = `http://127.0.0.1${file.path.replace(/\\/g, '/')}`;
    }
    return this.categoryService.update(id, updateCategoryDto, logoUrl);
  }
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.categoryService.findOne(id);
  }
  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.categoryService.remove(id);
  }
}
