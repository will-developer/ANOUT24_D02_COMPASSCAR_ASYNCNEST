import { Controller, Post, Body, Param, Put, Delete, Query, Get, UsePipes } from '@nestjs/common';
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
    private readonly prisma: PrismaService
  ) {}

  @Post()
  @UsePipes(
   ValidateDatePipe, 
   ValidateClientPipe, 
   ValidateCarPipe)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
  return this.orderService.create(createOrderDto);
  }

  @Put(':id')
  @UsePipes(
    ValidateDatePipe, 
    ValidateClientPipe, 
    ValidateCarPipe)
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
  return this.orderService.update(id, updateOrderDto);
  }

  @Get()
  async findAll(
    @Query('cpf') cpf: string | undefined,
    @Query('status') status: string | undefined,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<OrderResponseDto[]> {
    return this.orderService.findAll(cpf, status, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<OrderResponseDto> {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  async cancelOrder(@Param('id') id: number): Promise<void> {
    return this.orderService.cancelOrder(id);
  }
}

