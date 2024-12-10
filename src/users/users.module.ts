import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UsersService, UserRepository, PrismaService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
