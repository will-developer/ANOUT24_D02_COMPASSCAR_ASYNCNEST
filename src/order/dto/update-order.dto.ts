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
  @Matches(/^\d{5}-\d{3}$/, { message: 'CEP must be in the format XXXXX-XXX' })
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
