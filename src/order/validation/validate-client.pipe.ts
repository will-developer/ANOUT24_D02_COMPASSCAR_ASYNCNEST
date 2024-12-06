import { PipeTransform, Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; 

@Injectable()
export class ValidateClientPipe implements PipeTransform {
    constructor(private readonly prisma: PrismaService) {} 

  async transform(value: any) {
    const clientId = value.clientId;
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    if (!client || !client.status) { //validates if the client is active
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Client is not active.',
        error: 'Bad Request',
      })
    }

    //validates if the client has an open order
    const openOrder = await this.prisma.order.findFirst({ where: { clientId, statusOrder: 'open' } });
    if (openOrder) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Client already has an open order.',
        error: 'Bad Request',
      })
    }

    return value;  
  }
}
