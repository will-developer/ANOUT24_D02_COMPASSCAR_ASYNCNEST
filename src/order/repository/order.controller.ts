import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { ValidateDatePipe } from '../validation/validate-date.pipe';
import { ValidateClientPipe } from '../validation/validate-client.pipe';
import { ValidateCarPipe } from '../validation/validate-car.pipe';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
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
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
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
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of orders.',
    type: [OrderResponseDto],
  })
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
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order details.',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async findOne(@Param('id') id: number): Promise<OrderResponseDto> {
    try {
      return await this.orderService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({
    status: 204,
    description: 'Order successfully cancelled.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async cancelOrder(@Param('id') id: number): Promise<{ message: string }> {
    try {
      return await this.orderService.cancelOrder(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
