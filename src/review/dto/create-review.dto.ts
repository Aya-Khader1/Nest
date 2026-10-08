import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId({ message: 'Invalid product id' })
  @IsNotEmpty({ message: 'Product id is required' })
  product: string;
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  rating: number;
  @IsString()
  @IsNotEmpty({ message: 'Comment  is required' })
  @Length(3, 500)
  comment: string;
}
