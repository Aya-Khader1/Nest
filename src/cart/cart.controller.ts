import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import type { Request } from 'express';
import { addToCartDto } from './dto/create-cart.dto.js';
import { Types } from 'mongoose';
import { AuthGuard } from '../common/guards/auth.guard.js';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @UseGuards(AuthGuard)
  @Post('add')
  async addToCart(@Req() req: Request, @Body() dto: addToCartDto) {
    const userId = req.user?._id as unknown as string;
    return this.cartService.addToCart(userId, dto);
  }
  @Get()
  @UseGuards(AuthGuard)
  getCart(@Req() req: Request) {
    const userId = req.user?._id as unknown as string;
    return this.cartService.getCart(userId);
  }
  @Patch('item/:productId')
  @UseGuards(AuthGuard)
  async removeItem(@Req() req: Request, @Param('productId') productId: string) {
    const userId = req.user?._id as unknown as string;
    return this.cartService.removeItem(userId, productId);
  }
}
