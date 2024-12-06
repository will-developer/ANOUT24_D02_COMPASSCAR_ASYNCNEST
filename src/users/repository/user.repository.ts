import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.UserCreateInput): Promise<UserEntity> {
        return this.prisma.user.create({ data });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }
    
    async update(id: number, data: Prisma.UserUpdateInput): Promise<UserEntity> {
        return this.prisma.user.update({ where: { id }, data });
    }
    
    async findById(id: number): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }
}