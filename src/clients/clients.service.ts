import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dtos/create-client.dto';
import { ClientsRepository } from './repository/client.repository';
import { UpdateClientDto } from './dtos/update-client.dto';
import { Client } from '@prisma/client';
import { OrderService } from '../order/repository/order.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly repository: ClientsRepository,
    private readonly orderService: OrderService,
  ) {}

  async createClient(data: CreateClientDto): Promise<Client> {
    const client = await this.repository.findClientByCpfOrEmail(
      data.cpf,
      data.email,
    );

    const birthDate = new Date(data.birthDate);
    const age = this.idade(birthDate);

    if (client) {
      if (client.cpf === data.cpf) {
        throw new BadRequestException('A client with this CPF already exists.');
      }
      if (client.email === data.email) {
        throw new BadRequestException(
          'A client with this Email already exists.',
        );
      }
    }

    if (!age) {
      throw new BadRequestException('Must be 18 years or older');
    }
    return this.repository.createClient(data);
  }

  async getClientById(id: number): Promise<Client | null> {
    const client = await this.repository.findClientById(id);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async updateClient(id: number, data: UpdateClientDto): Promise<Client> {
    const client = await this.repository.findClientById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (data.cpf && data.cpf !== client.cpf) {
      const cpfExists = await this.repository.findClientByCpfOrEmail(
        data.cpf,
        null,
      );
      if (cpfExists) {
        throw new ConflictException('A client with this CPF already exists.');
      }
    }

    if (data.email && data.email !== client.email) {
      const emailExists = await this.repository.findClientByCpfOrEmail(
        null,
        data.email,
      );
      if (emailExists) {
        throw new ConflictException('A client with this email already exists.');
      }
    }

    if (!client.status) {
      throw new BadRequestException(
        'This client is inactive and cannot be updated',
      );
    }

    const updatedClient = await this.repository.updateClient(id, {
      ...data,
    });

    return updatedClient;
  }

  async deleteClient(id: number): Promise<Client> {
    const client = await this.repository.findClientById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.status === false) {
      throw new NotFoundException('Client not found');
    }

    const getAllOrders = await this.orderService.getAllOrders();

    getAllOrders.forEach((order) => {
      if (
        (order.clientId === id && order.statusOrder === 'open') ||
        order.statusOrder === 'approved'
      ) {
        throw new BadRequestException(
          'It is not possible to delete this client because it is part of an open/approved order',
        );
      }
    });

    return this.repository.deleteClient(id);
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
    const isFiltering = name || cpf || email || status;

    if (!isFiltering) {
      const result = await this.repository.getClientsByFilters({
        page,
        perPage,
        name: undefined,
        cpf: undefined,
        email: undefined,
        status: undefined,
      });

      return result;
    }

    const result = await this.repository.getClientsByFilters({
      page,
      perPage,
      name,
      cpf,
      email,
      status,
    });

    if (!result || result.clients.length === 0) {
      throw new NotFoundException('No clients found with these requirements');
    }

    return result;
  }

  idade(birthDate: Date): boolean {
    let date = new Date();
    const age = date.getFullYear() - birthDate.getFullYear();
    return age > 18;
  }
}
