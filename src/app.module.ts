import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OrderModule } from './order/repository/order.module';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CarModule } from './car/car.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CarModule, PrismaModule, UsersModule, ClientsModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
