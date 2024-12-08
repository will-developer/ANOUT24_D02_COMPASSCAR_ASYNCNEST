import {
  PipeTransform,
  Injectable,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ValidateCarPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    // Validates if car is active
    const carId = value.carId;
    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car || car.status == false) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Car is not active.',
        error: 'Bad Request',
      });
    }

    // validates if car already has an open or aproved order
    const existingOrderForCar = await this.prisma.order.findFirst({
      where: {
        carId: carId,
        statusOrder: {
          in: ['open', 'approved'],
        },
      },
    });
    if (existingOrderForCar) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Car is already in an open or approved order.',
        error: 'Bad Request',
      });
    }

    return value;
  }
}
