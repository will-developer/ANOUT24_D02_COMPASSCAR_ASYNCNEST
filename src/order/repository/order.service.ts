import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, StatusOrder } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import axios from 'axios';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  private async getAddressByCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        throw new HttpException('Invalid CEP', HttpStatus.BAD_REQUEST);
      }
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error while fetching address from VIACEP',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private calculateDays(
    startDate: Date | string,
    endDate: Date | string,
  ): number {
    const start =
      typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const timeDifference = end.getTime() - start.getTime();
    return timeDifference / (1000 * 3600 * 24);
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    try {
      const { clientId, carId, startDate, endDate, cep } = createOrderDto;

      //validates and searches for CEP in the VIA API
      const address = await this.getAddressByCep(cep);

      //rental fee calculation
      const rentalFee = parseFloat(address.gia) / 100;
      if (isNaN(rentalFee)) {
        throw new HttpException(
          'Invalid rental fee calculated from the address.',
          HttpStatus.BAD_REQUEST,
        );
      }

      //number of days calculation
      const days = this.calculateDays(startDate, endDate);

      //get car´s daily price
      const car = await this.prisma.car.findUnique({ where: { id: carId } });
      if (!car || !car.status) {
        throw new HttpException('Car is not available', HttpStatus.BAD_REQUEST);
      }
      const dailyPrice = car.dailyPrice;

      //total amount calculation
      const totalAmount = dailyPrice * days + rentalFee;

      //creates order on database
      const order = await this.prisma.order.create({
        data: {
          clientId,
          carId,
          startDate,
          endDate,
          cep,
          uf: address.uf,
          city: address.localidade,
          rentalFee,
          totalAmount,
          statusOrder: 'open',
          closeDate: null,
          lateFee: null,
        },
      });

      return this.convertToResponseDto(order);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const car = await this.prisma.car.findUnique({
      where: { id: updateOrderDto.carId },
    });
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    //updates order´s fields
    let rentalFee = order.rentalFee;
    let totalAmount = order.totalAmount;
    let updatedData: any = { statusOrder: updateOrderDto.statusOrder };

    //updates location data and recalculates rental fee if CEP is sent
    if (updateOrderDto.cep) {
      const address = await this.getAddressByCep(updateOrderDto.cep);
      rentalFee = parseFloat(address.gia) / 100;
      updatedData = {
        ...updatedData,
        cep: updateOrderDto.cep,
        uf: address.uf,
        city: address.localidade,
        rentalFee,
      };
    }

    //recalculates total amount if dates or the car are updated
    if (
      updateOrderDto.startDate ||
      updateOrderDto.endDate ||
      updateOrderDto.carId
    ) {
      const days = this.calculateDays(
        updateOrderDto.startDate || order.startDate,
        updateOrderDto.endDate || order.endDate,
      );
      totalAmount = car.dailyPrice * days + rentalFee;
      updatedData = { ...updatedData, totalAmount };
    }

    //updates order status
    if (updateOrderDto.statusOrder) {
      if (
        updateOrderDto.statusOrder === 'cancelled' &&
        order.statusOrder !== 'open'
      ) {
        throw new HttpException(
          'Only open orders can be canceled',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateOrderDto.statusOrder === 'approved' &&
        order.statusOrder !== 'open'
      ) {
        throw new HttpException(
          'Only open orders can be approved',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateOrderDto.statusOrder === 'closed' &&
        order.statusOrder !== 'approved'
      ) {
        throw new HttpException(
          'Only approved orders can be closed',
          HttpStatus.BAD_REQUEST,
        );
      }

      //calculates late fee if order is closed after close date
      if (
        updateOrderDto.statusOrder === 'closed' &&
        updateOrderDto.endDate &&
        new Date(updateOrderDto.endDate) < new Date()
      ) {
        const daysExceeded = this.calculateDays(
          updateOrderDto.endDate,
          new Date().toISOString(),
        );
        const lateFee = car.dailyPrice * 2 * daysExceeded;
        updatedData = { ...updatedData, lateFee, closeDate: new Date() };
      }
    }

    //updates order on database
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updatedData,
    });

    return this.convertToResponseDto(updatedOrder);
  }

  async findAll(
    cpf: string,
    status: string,
    page: number,
    limit: number,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        ...(cpf && { client: { cpf } }),
        ...(status && { statusOrder: status }),
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return orders.map((order) => this.convertToResponseDto(order));
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return this.convertToResponseDto(order);
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (order.statusOrder !== 'open') {
      throw new HttpException(
        'Only open orders can be cancelled',
        HttpStatus.BAD_REQUEST,
      );
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
