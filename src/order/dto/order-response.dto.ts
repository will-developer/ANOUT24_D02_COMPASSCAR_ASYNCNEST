import { StatusOrder } from "./create-order.dto";
import {  IsEnum } from 'class-validator';

export class OrderResponseDto {
    id: number;
    clientId: number;
    carId: number;
    startDate: Date;
    endDate: Date;
    cep: string;
    uf?: string;
    city?: string;
    rentalFee?: number;
    totalAmount?: number;
    closeDate?: Date;
    lateFee?: number;
    @IsEnum( StatusOrder)
    statusOrder?:  StatusOrder;
    createdAt?: Date;
    updatedAt?: Date;
  }
  