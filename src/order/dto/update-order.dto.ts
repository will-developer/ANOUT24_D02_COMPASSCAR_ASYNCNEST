import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
  Matches,
} from 'class-validator';

export enum StatusOrder {
  OPEN = 'open',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  CLOSED = 'closed',
}

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Client ID for the order',
    type: Number,
  })
  @IsInt()
  clientId: number;

  @ApiProperty({
    description: 'Car ID for the order',
    type: Number,
  })
  @IsInt()
  @IsOptional()
  carId?: number;

  @ApiProperty({
    description: 'Start date of the order',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date of the order',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'CEP for address lookup',
    type: String,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{5}-\d{3}$/, { message: 'CEP must be in the format XXXXX-XXX' })
  cep?: string;

  @ApiProperty({
    description:
      'Status of the order (it can be open, closed, approved or cancelled',
    type: String,
  })
  @IsOptional()
  @IsEnum(StatusOrder)
  statusOrder?: StatusOrder;

  @ApiProperty({
    description: 'Value of rental',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  rentalFee?: number;

  @ApiProperty({
    description: 'Total value of the order',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}
