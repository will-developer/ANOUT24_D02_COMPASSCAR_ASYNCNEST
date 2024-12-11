import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './repository/car.repository';
import { OrderService } from '../order/repository/order.service';
import { CarFiltersDto } from './dto/filters-car.dto';

@Injectable()
export class CarService {
  constructor(
    private readonly repository: CarRepository,
    private readonly orderService: OrderService,
  ) {}
  //todo: verificar se os erros estão certos
  async create(createCarDto: CreateCarDto) {
    const existCar = await this.repository.findByPlate(createCarDto.plate);
    if (existCar) {
      throw new BadRequestException('A car with this plate already exist');
    }

    const arrItems = createCarDto.items;
    const uniqueArrItems = new Set(arrItems.map((items) => items.name));

    if (uniqueArrItems.size !== arrItems.length) {
      throw new BadRequestException(
        'Items and accessories cannot be duplicated.',
      );
    }

    return this.repository.create(createCarDto);
  }

  async findAll(filters: CarFiltersDto) {
    if (filters.page < 1 || filters.limit < 1) {
      throw new BadRequestException(
        'Page and limit must be greater than zero.',
      );
    }

    if (filters.km && filters.km < 0) {
      throw new BadRequestException('Kilometers cannot be negative.');
    }

    if (filters.dailyPrice && filters.dailyPrice < 0) {
      throw new BadRequestException('Daily price cannot be negative.');
    }
    return this.repository.findAll(filters);
  }

  async findOne(id: number) {
    const findCar = await this.repository.findCarById(id);

    if (!findCar) {
      throw new NotFoundException('Car not found');
    }

    return this.repository.findOne(id);
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const findCar = await this.repository.findCarById(id);
    if (!findCar) {
      throw new NotFoundException('Car not found');
    }

    if (updateCarDto.status === false) {
      throw new BadRequestException(
        'It is not possible to change a car with inactive status',
      );
    }

    return this.repository.update(id, updateCarDto);
  }

  async remove(id: number) {
    const findCar = await this.repository.findCarById(id);

    if (!findCar) {
      throw new NotFoundException('Car not found');
    }

    const getAllOrders = await this.orderService.getAllOrders();

    getAllOrders.forEach((order) => {
      if (
        (order.carId === id && order.statusOrder === 'open') ||
        order.statusOrder === 'approved'
      ) {
        throw new BadRequestException(
          'It is not possible to delete this car because it is part of an open order, see the order table',
        );
      }
    });

    return this.repository.delete(id);
  }
}
