import { Injectable } from '@nestjs/common';
import { CreateCarDto } from '../dto/create-car.dto';
import { CarEntity } from '../entities/car.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCarDto } from '../dto/update-car.dto';
import { CarFilters } from '../filters/carFilters';

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

  async findAllWithParams(
    page: number,
    limit: number,
    filters: CarFilters,
  ): Promise<{ data: CarEntity[]; total: number; totalPages?: number }> {
    const skip = (page - 1) * limit;
    const where = {
      ...(filters.brand && { brand: { contains: filters.brand } }),
      ...(filters.km && { km: { lte: filters.km } }),
      ...(filters.year && { year: { gte: filters.year } }),
      ...(filters.status !== undefined && { status: filters.status }),
      ...(filters.dailyPrice && { dailyPrice: { lte: filters.dailyPrice } }),
    };

    const data = await this.prisma.car.findMany({
      where,
      skip,
      take: limit,
      include: {
        items: {
          select: {
            name: true,
            carId: true,
          },
        },
      },
    });

    const total = await this.prisma.car.count({ where });

    const totalPages = Math.ceil(total / limit);

    if (totalPages > 1) {
      return { data, total, totalPages };
    }
    return { data, total };
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

  async findByPlate(plate: string) {
    return this.prisma.car.findUnique({ where: { plate } });
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

  async delete(id: number): Promise<CarEntity> {
    await this.prisma.carItem.deleteMany({
      where: {
        carId: id,
      },
    });

    return this.prisma.car.delete({
      where: {
        id,
      },
    });
  }
}
