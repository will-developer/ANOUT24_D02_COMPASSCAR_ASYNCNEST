import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

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

  @ApiProperty({
    required: false,
    type: String,
    description: 'Car mileage',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true }) // Converte para número
  km?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Car year',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true }) // Converte para número
  year?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Cars daily price',
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true }) // Converte para float
  dailyPrice?: number;
}
