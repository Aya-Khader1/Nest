import { MongooseModule, Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Review {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxLength: 500,
  })
  comment: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Product',
  })
  product: Types.ObjectId;
  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
  })
  rating: number;
}
export const reviewSchema = SchemaFactory.createForClass(Review);
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
export type HReviewDocument = HydratedDocument<Review>;
export const ReviewModel = MongooseModule.forFeature([
  { name: Review.name, schema: reviewSchema },
]);
