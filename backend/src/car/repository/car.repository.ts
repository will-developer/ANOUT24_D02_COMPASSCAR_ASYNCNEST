import { Injectable } from '@nestjs/common';
import { CreateCarDto } from '../dto/create-car.dto';
import { CarEntity } from '../entities/car.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarDto: CreateCarDto): Promise<CarEntity> {
    return this.prisma.car.create({
      data: createCarDto,
      include: {
        items: {
          select: {
            name: true,
            carId: true,
          },
        },
      },
    });
  }
}
