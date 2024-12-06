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

    async findAll(params: { email?: string; name?: string; status?: boolean }, skip: number, take: number) {
        const { email, name, status } = params;
        const takeNumber = Number(take);
        return this.prisma.user.findMany({
          where: {
            email: email ? { contains: email } : undefined,
            name: name ? { contains: name } : undefined,
            status: status !== undefined ? status : undefined,
          },
          skip,
          take: takeNumber,
        });
    }
   
    async findById(id: number): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }
}