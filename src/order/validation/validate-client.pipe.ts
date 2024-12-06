import { PipeTransform, Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; 

@Injectable()
export class ValidateClientPipe implements PipeTransform {
    constructor(private readonly prisma: PrismaService) {} 

  async transform(value: any) {
    const clientId = value.clientId;
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    if (!client || !client.status) { //validates if the client is active
      throw new BadRequestException('Client is not active');
    }

    //validates if the client has an open order
    const openOrder = await this.prisma.order.findFirst({ where: { clientId, statusOrder: 'open' } });
    if (openOrder) {
      throw new BadRequestException('Client already has an open order');
    }

    return value;  
  }
}
