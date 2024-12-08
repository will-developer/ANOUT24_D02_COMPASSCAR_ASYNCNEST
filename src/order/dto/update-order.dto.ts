import {
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export enum StatusOrder {
  OPEN = 'open',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  CLOSED = 'closed',
}

export class UpdateOrderDto {
  @IsInt()
  @IsOptional()
  clientId?: number;

  @IsInt()
  @IsOptional()
  carId?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsOptional()
  @IsEnum(StatusOrder)
  statusOrder?: StatusOrder;

  @IsNumber()
  @IsOptional()
  rentalFee?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}
