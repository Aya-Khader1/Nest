import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { UserModel } from '../DB/models/user.model.js';
import { ProductModel } from '../DB/models/product.model.js';
import { cartModel } from '../DB/models/cart.model.js';
import { CouponModel } from '../DB/models/coupon.model.js';
import { OrderModel } from '../DB/models/order.model.js';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../common/services/token.service.js';

@Module({
  imports: [UserModel, ProductModel, cartModel, CouponModel, OrderModel],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService, TokenService],
})
export class OrdersModule {}
