import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { CarRepository } from './repository/car.repository';
import { PrismaService } from '../prisma/prisma.service';
import { OrderModule } from '../order/repository/order.module';

@Module({
  imports: [OrderModule],
  controllers: [CarController],
  providers: [CarService, CarRepository, PrismaService],
})
export class CarModule {}
