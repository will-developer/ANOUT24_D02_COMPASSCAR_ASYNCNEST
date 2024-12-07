import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Client } from '@prisma/client';

@Controller('client')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @Post()
  async createClient(@Body() data: CreateClientDto): Promise<Client> {
    return this.clientsService.createClient(data);
  }

  @Put(':id')
  async updateClient(
    @Param('id') id: number,
    @Body() data: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.updateClient(id, data);
  }

  @Get()
  async getClientByFilters(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('name') name?: string,
    @Query('cpf') cpf?: string,
    @Query('email') email?: string,
    @Query('status') status?: string,
  ): Promise<{
    clients: Client[];
    total: number;
    page: number;
    perPage: number;
  }> {
    return this.clientsService.getClientsByFilters({
      page,
      perPage,
      name,
      cpf,
      email,
      status,
    });
  }

  @Get(':id')
  async getClientById(@Param('id') id: number): Promise<Client> {
    return this.clientsService.getClientById(id);
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: number): Promise<{ message: string }> {
    await this.clientsService.deleteClient(id);
    return { message: 'Client successfully deleted' };
  }
}
