import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsDate,
  Matches,
} from 'class-validator';

export enum StatusOrder {
  OPEN = 'open',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  CLOSED = 'closed',
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Client ID for the order',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({
    description: 'Car ID for the order',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  carId: number;

  @ApiProperty({
    description: 'Start date of the order',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the order',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'CEP for address lookup',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}-\d{3}$/, { message: 'CEP must be in the format XXXXX-XXX' })
  cep: string;

  @ApiProperty({
    description: 'Federative Unit in which client lives in',
    type: String,
  })
  @IsString()
  @IsOptional()
  uf?: string;

  @ApiProperty({
    description: 'City in which client lives',
    type: String,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Value of rental',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  rentalFee?: number;

  @ApiProperty({
    description: 'Date which client agreed to bring back the car',
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  closeDate?: Date;

  @ApiProperty({
    description:
      'Fine value applied to total amount in case of client not bringing car back at close date',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  lateFee?: number;

  @ApiProperty({
    description: 'Total value of the order',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}
