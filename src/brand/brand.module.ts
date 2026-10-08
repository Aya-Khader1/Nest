import { Module } from '@nestjs/common';
import { BrandService } from './brand.service.js';
import { BrandController } from './brand.controller.js';
import { UserModel } from '../DB/models/user.model.js';
import { CategoryModel } from '../DB/models/category.model.js';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service.js';
import { BrandModel } from '../DB/models/brand.model.js';
import { AuthModule } from '../auth/auth.module.js';
import { TokenService } from '../common/services/token.service.js';

@Module({
  imports: [CategoryModel, BrandModel, AuthModule, UserModel],
  controllers: [BrandController],
  providers: [BrandService, JwtService, TokenService],
})
export class BrandModule {}
