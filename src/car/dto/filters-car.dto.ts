import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsNumber,
  IsPositive,
  Max,
} from 'class-validator';

export class CarFiltersDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Page number',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number = 10;

  @ApiProperty({
    required: false,
    type: String,
    description: "Brand's car",
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Car mileage',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  km?: number;

  @Min(new Date().getFullYear() - 10, {
    message: 'The car must be at most 10 years old.',
  })
  @Max(new Date().getFullYear() + 1, {
    message: 'The car year cannot be in the future.',
  })
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Car year',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  year?: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Cars daily price',
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  dailyPrice?: number;
}
