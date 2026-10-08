import { MongooseModule, Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxLength: 20,
  })
  name: string;
  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;
  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  stock: number;
  @Prop([
    {
      type: String,
      required: true,
    },
  ])
  images: string[];
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Category',
  })
  category: Types.ObjectId;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Brand',
  })
  brand: Types.ObjectId;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;
}
export const productSchema = SchemaFactory.createForClass(Product);

export type HProductDocument = HydratedDocument<Product>;
export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: productSchema },
]);
