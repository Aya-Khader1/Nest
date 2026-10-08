import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { BrandService } from './brand.service.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';
import { UpdateBrandDto } from './dto/update-brand.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { multerOptions } from '../common/utils/multer.util.js';
import { Types } from 'mongoose';
import type { Request } from 'express';
import { AdminGuard } from '../common/guards/role.guard.js';

@Controller('brand')
@UseGuards(AuthGuard, AdminGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body()
    createBrandDto: CreateBrandDto,
  ) {
    if (!file) throw new BadRequestException('Category Logo is required');
    const logoUrl = `http://127.0.0.1${file.path.replace(/\\/g, '/')}`;
    const adminId = req.user!._id as unknown as Types.ObjectId;
    return this.brandService.create(createBrandDto, logoUrl, adminId);
  }
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let logoUrl: string | undefined;
    if (file) logoUrl = `http://127.0.0.1${file.path.replace(/\\/g, '/')}`;

    return this.brandService.update(id, updateBrandDto, logoUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
