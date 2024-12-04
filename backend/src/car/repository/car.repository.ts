import { Injectable } from '@nestjs/common';
import { CreateCarDto } from '../dto/create-car.dto';
import { CarEntity } from '../entities/car.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateCarDto): Promise<CarEntity> {}
}
