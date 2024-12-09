import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidateDatePipe } from '../validation/validate-date.pipe';
import { ValidateClientPipe } from '../validation/validate-client.pipe';
import { ValidateCarPipe } from '../validation/validate-car.pipe';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    ValidateClientPipe,
    ValidateCarPipe,
    ValidateDatePipe,
  ],
})
export class OrderModule {}
