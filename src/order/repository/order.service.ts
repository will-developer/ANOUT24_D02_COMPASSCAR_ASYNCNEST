import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto, StatusOrder } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

   async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const { clientId, carId, startDate, endDate, cep } = createOrderDto;
  
    //creates order on database
    const order = await this.prisma.order.create({
      data: {
        clientId,
        carId,
        startDate,
        endDate,
        cep,
        uf,
        city,
        rentalFee,
        totalAmount,
        statusOrder: 'open', 
        closeDate: null, 
        lateFee: null, 
      },
    });
  
    return this.convertToResponseDto(order);
  }
  
    async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    const car = await this.prisma.car.findUnique({ where: { id: updateOrderDto.carId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    async findAll(cpf: string, status: string, page: number, limit: number): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        ...(cpf && { client: { cpf } }),
        ...(status && { statusOrder: status }),
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return orders.map(order => this.convertToResponseDto(order));
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.convertToResponseDto(order);
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.statusOrder !== 'open') {
      throw new BadRequestException('Only open orders can be cancelled');
    }

    await this.prisma.order.update({
      where: { id },
      data: { statusOrder: 'cancelled', canceledAt: new Date() },
    });
  }
    
  private convertToResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      clientId: order.clientId,
      carId: order.carId,
      startDate: order.startDate,
      endDate: order.endDate,
      cep: order.cep,
      uf: order.uf,
      city: order.city,
      rentalFee: order.rentalFee,
      totalAmount: order.totalAmount,
       statusOrder: order.statusOrder as StatusOrder,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
  }

  
