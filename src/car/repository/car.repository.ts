import { BadRequestException, Injectable } from '@nestjs/common';
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
    const { plate, items, brand, model, ...carData } = updateCarDto;

    if (
      !updateCarDto ||
      (!updateCarDto.brand &&
        !updateCarDto.model &&
        !updateCarDto.year &&
        !updateCarDto.km &&
        !updateCarDto.dailyPrice &&
        !updateCarDto.items)
    ) {
      throw new BadRequestException(
        'At least one field (brand, model, year, km, dailyPrice, items) must be provided for update.',
      );
    }

    if ((brand && !model) || model === '') {
      throw new BadRequestException(
        'The model must be provided when updating the brand.',
      );
    }

    if (plate) {
      throw new BadRequestException('It is not possible to change the plate.');
    }

    if (items) {
      await this.prisma.car.update({
        where: { id },
        data: {
          items: {
            deleteMany: {},
          },
        },
      });

      return this.prisma.car.update({
        where: { id },
        data: {
          ...carData,
          updatedAt: new Date(),
          brand,
          model,
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

    return this.prisma.car.update({
      where: { id },
      data: {
        ...carData,
        brand,
        model,
        updatedAt: new Date(),
      },
      include: {
        items: {
          select: {
            name: true,
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
