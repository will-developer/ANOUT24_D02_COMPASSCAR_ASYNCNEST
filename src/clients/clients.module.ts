import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientsRepository } from './repository/client.repository';
import { OrderModule } from '../order/repository/order.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule, OrderModule],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
