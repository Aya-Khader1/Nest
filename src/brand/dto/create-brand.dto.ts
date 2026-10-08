import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is requeird' })
  @Length(2, 20, {
    message: 'Brand name must be between 2 and 20 character',
  })
  @Transform(({ value }) => value?.trim())
  name: string;
  @IsArray({ message: 'categories must be as an array' })
  @IsMongoId({
    each: true,
    message: 'Each category ID must be a valid mongodb ObjectId',
  })
  @ArrayNotEmpty({ message: 'At least one category Id must be exists' })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    }

    return value;
  })
  categories: string[];
}
