import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { AdminGuard } from '../common/guards/role.guard.js';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/utils/multer.util.js';
import type { Request } from 'express';
import { Types } from 'mongoose';
import { CachingInterceptor } from '../caching/interceptors/http-cache.interceptor.js';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files) throw new BadRequestException('Product image must be required');
    const imagesUrl: string[] = files.map(
      (file) => `http://127.0.0.1:3000/${file.path.replace(/\\/g, '/')}`,
    );
    const adminId = req.user?._id as unknown as Types.ObjectId;
    return this.productService.create(createProductDto, imagesUrl, adminId);
  }

  @UseInterceptors(CachingInterceptor)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CachingInterceptor)
  findOne(@Param('id') id: Types.ObjectId) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
