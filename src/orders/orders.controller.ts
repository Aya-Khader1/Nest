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
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { Types } from 'mongoose';
import type { Request } from 'express';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(AuthGuard)
  checkOut(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const userId = req.user?._id as unknown as Types.ObjectId;
    return this.ordersService.createOrder(createOrderDto, userId);
  }
}
