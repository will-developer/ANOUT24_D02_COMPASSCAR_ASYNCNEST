import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Get,
  UsePipes,
  HttpStatus,
  HttpException,
  Catch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { ValidateDatePipe } from '../validation/validate-date.pipe';
import { ValidateClientPipe } from '../validation/validate-client.pipe';
import { ValidateCarPipe } from '../validation/validate-car.pipe';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(ValidateDatePipe, ValidateClientPipe, ValidateCarPipe)
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UsePipes(ValidateDatePipe, ValidateClientPipe, ValidateCarPipe)
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    try {
      return await this.orderService.update(id, updateOrderDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(
    @Query('cpf') cpf: string | undefined,
    @Query('status') status: string | undefined,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<OrderResponseDto[]> {
    try {
      return await this.orderService.findAll(cpf, status, page, limit);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<OrderResponseDto> {
    try {
      return await this.orderService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async cancelOrder(@Param('id') id: number): Promise<void> {
    try {
      return await this.orderService.cancelOrder(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
