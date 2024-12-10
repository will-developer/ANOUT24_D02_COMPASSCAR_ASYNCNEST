import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { CarRepository } from './repository/car.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [CarController],
  providers: [CarService, CarRepository, PrismaService],
})
export class CarModule {}
