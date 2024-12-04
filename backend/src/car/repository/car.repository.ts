import { Injectable } from '@nestjs/common';
import { CreateCarDto } from '../dto/create-car.dto';
import { CarEntity } from '../entities/car.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarDto: CreateCarDto): Promise<CarEntity> {
    const { items, ...carData } = createCarDto;

    return this.prisma.car.create({
      data: {
        ...carData,
        items: {
          create: items.map((item) => ({
            name: item.name,
          })),
        },
      },
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

  async findAll(): Promise<CarEntity[]> {
    return await this.prisma.car.findMany({
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
