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

  async findAll(
    filters: CarFilters,
  ): Promise<{ data: CarEntity[]; total: number; totalPages?: number }> {
    if (isNaN(filters.page)) {
      filters.page = 1;
    }

    if (isNaN(filters.limit)) {
      filters.limit = 10;
    }

    const skip = (filters.page - 1) * filters.limit;
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
      take: filters.limit,
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

    const totalPages = Math.ceil(total / filters.limit);

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

  async findCarById(id: number) {
    return this.prisma.car.findFirst({ where: { id } });
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<CarEntity> {
    const { items, ...carData } = updateCarDto;

    return this.prisma.car.update({
      where: {
        id,
      },
      data: {
        ...carData,
        updatedAt: new Date(),
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

  async delete(id: number): Promise<{ message: string }> {
    const existCar = await this.prisma.car.findFirst({
      where: { id },
    });

    if (!existCar.status) {
      return {
        message: `This car has already been deleted`,
      };
    }

    const status = false;
    const inactivatedAt = new Date();

    await this.prisma.car.update({
      where: { id },
      data: {
        status,
        inactivatedAt,
      },
    });

    return {
      message: `The car with the plate: ${existCar.plate} has been deleted`,
    };
  }
}
