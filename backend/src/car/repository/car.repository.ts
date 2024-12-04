import { Injectable } from '@nestjs/common';
import { CreateCarDto } from '../dto/create-car.dto';
import { CarEntity } from '../entities/car.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCarDto } from '../dto/update-car.dto';

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

  async findOne(id: number): Promise<CarEntity> {
    return this.prisma.car.findUnique({
      where: {
        id,
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

  async update(id: number, updateCarDto: UpdateCarDto): Promise<CarEntity> {
    const { items, ...carData } = updateCarDto;
    return this.prisma.car.update({
      where: {
        id,
      },
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
}
