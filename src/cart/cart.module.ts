import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { cartModel } from '../DB/models/cart.model.js';
import { ProductModel } from '../DB/models/product.model.js';
import { TokenService } from '../common/services/token.service.js';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module.js';
import { UserModel } from '../DB/models/user.model.js';

@Module({
  imports: [cartModel, ProductModel, AuthModule, UserModel],
  controllers: [CartController],
  providers: [CartService, TokenService, JwtService],
})
export class CartModule {}
