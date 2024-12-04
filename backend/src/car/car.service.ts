import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './repository/car.repository';

@Injectable()
export class CarService {
  constructor(private readonly repository: CarRepository) {}

  create(createCarDto: CreateCarDto) {
    return this.repository.create(createCarDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return this.repository.update(id, updateCarDto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
