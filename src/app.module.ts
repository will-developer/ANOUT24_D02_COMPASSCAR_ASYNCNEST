import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/repository/order.module';

@Module({
  imports: [OrderModule],
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CarModule } from './car/car.module';

@Module({
  imports: [CarModule, PrismaModule, UsersModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
