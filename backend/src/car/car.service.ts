import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './repository/car.repository';
import { CarFilters } from './filters/carFilters';

@Injectable()
export class CarService {
  constructor(private readonly repository: CarRepository) {}
  //todo: verificar se os erros estão certos
  async create(createCarDto: CreateCarDto) {
    const existCar = await this.repository.findByPlate(createCarDto.plate);

    if (existCar) {
      throw new BadRequestException('A car with this plate already exist');
    }

    return this.repository.create(createCarDto);
  }

  async findAll(filters: CarFilters) {
    if (filters.page < 1 || filters.limit < 1) {
      throw new Error('Page and limit must be greater than zero.');
    }

    if (filters.km && filters.km < 0) {
      throw new Error('Kilometers cannot be negative.');
    }

    if (filters.dailyPrice && filters.dailyPrice < 0) {
      throw new Error('Daily price cannot be negative.');
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
    return this.repository.update(id, updateCarDto);
  }

  async remove(id: number) {
    const findCar = await this.repository.findCarById(id);

    if (!findCar) {
      throw new NotFoundException('Car not found');
    }
    return this.repository.delete(id);
  }
}
