import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service.js';
import { CreateCouponDto } from './dto/create-coupon.dto.js';
import { UpdateCouponDto } from './dto/update-coupon.dto.js';
import type { Request } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { AdminGuard } from '../common/guards/role.guard.js';
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(@Body() createCouponDto: CreateCouponDto, @Req() req: Request) {
    const adminId = req.user?._id as unknown as Types.ObjectId;
    return this.couponService.create(createCouponDto, adminId);
  }
  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }
  @Post('validate')
  @UseGuards(AuthGuard, AdminGuard)
  validate(@Body('code') code: string, @Req() req: Request) {
    const userId = req.user?._id as unknown as Types.ObjectId;

    return this.couponService.validate(code, userId);
  }
  @Get()
  findAll() {
    return this.couponService.findAll();
  }
}
