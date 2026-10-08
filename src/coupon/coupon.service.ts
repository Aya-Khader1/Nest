import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto.js';
import { UpdateCouponDto } from './dto/update-coupon.dto.js';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, HCouponDocument } from '../DB/models/coupon.model.js';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly _couponModel: Model<HCouponDocument>,
  ) {}
  async create(createCouponDto: CreateCouponDto, adminId: Types.ObjectId) {
    const cleanCode = createCouponDto.code.toUpperCase().trim();
    const existing = await this._couponModel.exists({ code: cleanCode });
    if (existing)
      throw new ConflictException('A Coupon with this code already exists');
    const newCoupon = new this._couponModel({
      ...createCouponDto,
      code: cleanCode,
      createdBy: adminId,
    });

    return (await newCoupon.save()).populate('createdBy', 'email -_id');
  }

  async update(id: Types.ObjectId, updateCouponDto: UpdateCouponDto) {
    const updated = await this._couponModel
      .findByIdAndUpdate(id, updateCouponDto, { new: true })
      .populate('createdBy', 'email -_id');
    if (!updated) throw new NotFoundException('Coupon not found');
    return updated;
  }
  async validate(code: string, userId: Types.ObjectId) {
    const coupon = await this._couponModel.findOne({
      code: code.toUpperCase().trim(),
    });
    if (!coupon) throw new NotFoundException('Invalid coupon code');
    if (new Date() > coupon.expireyDate)
      throw new BadRequestException('This coupon code has expired');
    if (coupon.usedCount >= coupon.maxUsage)
      throw new BadRequestException(
        'This coupon code has reached its maximum usage limit',
      );
    const hasUsed = coupon.usedBy
      .map((id) => id.toString())
      .includes(userId.toString());
    console.log('hasUsed', typeof userId);

    console.log('hasUsed', typeof coupon.usedBy);
    if (hasUsed)
      throw new BadRequestException('You have already used this coupon code');

    return coupon;
  }

  findAll() {
    return this._couponModel.find().populate('createdBy', 'email -_id');
  }
}
