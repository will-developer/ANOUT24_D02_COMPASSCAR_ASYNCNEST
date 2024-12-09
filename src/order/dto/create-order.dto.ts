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
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsNotEmpty()
  carId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}-\d{3}$/, { message: 'CEP must be in the format XXXXX-XXX' })
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

  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}
