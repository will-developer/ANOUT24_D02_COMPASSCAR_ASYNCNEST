import { Injectable } from '@nestjs/common';
import { CreateClientDto } from '../dtos/create-client.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { Client } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(data: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  async findClientByCpfOrEmail(
    cpf?: string,
    email?: string,
  ): Promise<Client | null> {
    const entryValue: { cpf?: string; email?: string; status: boolean }[] = [];

    if (cpf) {
      entryValue.push({
        cpf,
        status: true,
      });
    }

    if (email) {
      entryValue.push({
        email,
        status: true,
      });
    }

    return this.prisma.client.findFirst({
      where: {
        OR: entryValue,
      },
    });
  }

  async findClientById(id: number): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: {
        id,
      },
    });
  }

  async updateClient(id: number, data: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deleteClient(id: number): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: {
        status: false,
        inactivatedAt: new Date(),
      },
    });
  }

  async getClientsByFilters({
    page,
    perPage,
    name,
    cpf,
    email,
    status,
  }): Promise<{
    clients: Client[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const skip = (page - 1) * perPage;

    const clients = await this.prisma.client.findMany({
      skip,
      take: Number(perPage),
      where: {
        name: name ? { contains: name } : undefined,
        email: email ? { contains: email } : undefined,
        cpf: cpf ? { contains: cpf } : undefined,
        status: status
          ? status === 'active'
            ? true
            : status === 'inactive'
              ? false
              : undefined
          : undefined,
      },
    });

    const totalClients = await this.prisma.client.count({
      where: {
        name: { contains: name },
        email: { contains: email },
        cpf: { contains: cpf },
        status:
          status !== undefined
            ? status === 'active'
              ? true
              : status === 'inactive'
                ? false
                : undefined
            : undefined,
      },
    });

    return {
      clients: clients,
      total: totalClients,
      page,
      perPage,
    };
  }
}
