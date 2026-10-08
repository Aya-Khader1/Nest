import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class addToCartDto {
  @IsMongoId({ message: 'Invalid product ID' })
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
