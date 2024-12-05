import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    async create(data: Partial<UserEntity>): Promise<UserEntity> {
        return this.prisma.user.create({ data });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }
    
    
}