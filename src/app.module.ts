import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OrderModule } from './order/repository/order.module';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CarModule } from './car/car.module';
import { AppService } from './app.service';

@Module({
  imports: [CarModule, PrismaModule, UsersModule, ClientsModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
