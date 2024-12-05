import { IsDateString, IsNotEmpty, IsOptional, IsString, IsInt, IsNumber, IsEnum } from 'class-validator';

export enum StatusOrder {
  OPEN = 'open',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  CLOSED = 'closed',
}

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsNotEmpty()
  carId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsOptional()
  uf?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  rentalFee?: number;

  @IsDateString()
  @IsOptional()
  closeDate?: Date;

  @IsNumber()
  @IsOptional()
  lateFee?: number;

  @IsEnum(StatusOrder)
  @IsString()
  statusOrder: StatusOrder;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;

  @IsDateString()
  @IsOptional()
  canceledAt?: Date;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}

