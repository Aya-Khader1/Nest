import { Transform, Type } from 'class-transformer';
import {
  IsEmpty,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Product name must be string' })
  @IsNotEmpty({ message: 'Product name must be required' })
  @Length(2, 20)
  @Transform(({ value }) => value?.trim())
  name: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'price must be a valid number' })
  @Min(1, { message: 'Price cannot be zero or negative value' })
  price: number;
  @Type(() => Number)
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Min(0, { message: 'Stock cannot be zero or negative value' })
  @IsInt()
  stock: number;

  @IsMongoId({ message: 'Invalid brand id format' })
  @IsNotEmpty({ message: 'Brand name must be required' })
  brand: string;
  @IsMongoId({ message: 'Invalid category id format' })
  @IsNotEmpty({ message: 'category name must be required' })
  category: string;
}
