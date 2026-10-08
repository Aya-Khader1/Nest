import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service.js';
import { CouponController } from './coupon.controller.js';
import { UserModel } from '../DB/models/user.model.js';
import { CouponModel } from '../DB/models/coupon.model.js';
import { TokenService } from '../common/services/token.service.js';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel, CouponModel],
  controllers: [CouponController],
  providers: [CouponService, TokenService, JwtService],
})
export class CouponModule {}
