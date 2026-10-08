import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { HOrderDocument, Order } from '../DB/models/order.model.js';
import { Model, Types } from 'mongoose';
import { Cart, HCartDocument } from '../DB/models/cart.model.js';
import { HProductDocument, Product } from '../DB/models/product.model.js';
import { Coupon, HCouponDocument } from '../DB/models/coupon.model.js';
import { OrderStatusEnum } from '../common/enums/order.enum.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<HOrderDocument>,
    @InjectModel(Cart.name) private readonly cartModel: Model<HCartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
    @InjectModel(Coupon.name)
    private readonly _couponModel: Model<HCouponDocument>,
  ) {}
  async createOrder(createOrderDto: CreateOrderDto, userId: Types.ObjectId) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product');
    if (!cart || cart.items.length === 0)
      throw new BadRequestException(
        'Your checkout pipline failed :Cart is currently empty',
      );
    const orderItem: any[] = [];
    let calculatedSubTotal = 0;
    for (const item of cart.items) {
      const dbproduct = await this.productModel.findById(item.product);
      if (!dbproduct)
        throw new NotFoundException(
          `Checkout aborted Product ID no longer exists`,
        );
      if (dbproduct.stock < item.quantity)
        throw new BadRequestException(
          `Insuffecent stock.Only ${dbproduct.stock} units available`,
        );
      calculatedSubTotal += dbproduct.price * item.quantity;
      orderItem.push({
        product: item.product,
        quantity: item.quantity,
        priceSanpShot: dbproduct.price,
      });
    }
    let discountAmount = 0;
    let targetCoupon: HCouponDocument | null = null;
    if (createOrderDto.appliedCoupon) {
      targetCoupon = await this._couponModel.findOne({
        code: createOrderDto.appliedCoupon.toUpperCase().trim(),
      });
      if (!targetCoupon) throw new NotFoundException('Invalid coupon code');
      if (new Date() > targetCoupon.expireyDate)
        throw new BadRequestException('This coupon code has expired');
      if (targetCoupon.usedCount >= targetCoupon.maxUsage)
        throw new BadRequestException(
          'This coupon code has reached its maximum usage limit',
        );
      discountAmount =
        (calculatedSubTotal * targetCoupon.discountPercentage) / 100;
    }
    const finalTotal = calculatedSubTotal - discountAmount;
    if (targetCoupon) {
      await this._couponModel.findByIdAndUpdate(targetCoupon._id, {
        $inc: { usedCount: 1 },
        $push: { usedBy: userId },
      });
    }
    const order = new this.orderModel({
      user: userId,
      items: orderItem,
      subTotal: calculatedSubTotal,
      discount: discountAmount,
      finalTotal,
      shippingAddress: createOrderDto.shippingAddress,
      appliedCoupon: targetCoupon?._id || null,
      status: OrderStatusEnum.PENDING,
    });
    await order.save();
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    return order.populate('items.product', 'name price');
  }
}
