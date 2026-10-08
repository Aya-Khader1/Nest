import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, HCartDocument } from '../DB/models/cart.model.js';
import { HProductDocument, Product } from '../DB/models/product.model.js';
import { addToCartDto } from './dto/create-cart.dto.js';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly _cartModel: Model<HCartDocument>,
    @InjectModel(Product.name)
    private readonly _productModel: Model<HProductDocument>,
  ) {}
  private recalculateCartTotal(cart: HCartDocument): void {
    let total = 0;
    for (const item of cart.items) {
      item.subTotal = item.quantity * item.pricePerUnit;
      total += item.subTotal;
    }
    cart.totalPrice = total;
  }
  async addToCart(userId: string, dto: addToCartDto): Promise<HCartDocument> {
    const { productId, quantity } = dto;
    const product = await this._productModel.findById(productId);
    if (!product) throw new NotFoundException('Product Not found');
    if (product.stock < quantity)
      throw new BadRequestException(
        `Insuffecent stock.Only ${product.stock} units avalible`,
      );
    let cart = await this._cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this._cartModel({ user: userId, items: [] });
    }
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (existingItemIndex > -1) {
      const targetNewQuantity =
        cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < targetNewQuantity)
        throw new BadRequestException(
          `Cannot add,Combined cart total ${targetNewQuantity} exceeds avalible stock ${product.stock}`,
        );
      cart.items[existingItemIndex].quantity = targetNewQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        pricePerUnit: product.price,
        subTotal: quantity * product.price,
      });
    }
    this.recalculateCartTotal(cart);

    return (await cart.save()).populate('items.product');
  }
  async getCart(userId: string) {
    let cart = await this._cartModel
      .findOne({ user: userId })
      .populate('items.product');
    if (!cart) {
      cart = new this._cartModel({ user: userId, items: [] });
      await cart.save();
    }
    return cart;
  }

  async removeItem(userId: string, productId: string) {
    let cart = await this._cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    this.recalculateCartTotal(cart);

    return (await cart.save()).populate('items.product');
  }
}
