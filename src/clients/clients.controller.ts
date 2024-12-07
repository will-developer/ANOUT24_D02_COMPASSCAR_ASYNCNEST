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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Client } from '@prisma/client';
import { ClientFiltersDto } from './dtos/filters-client.dto';

@Controller('client')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // CREATE CLIENT
  @ApiOperation({ summary: 'Create a Client' })
  @ApiResponse({
    status: 201,
    description: 'Client successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  @Post()
  async createClient(@Body() data: CreateClientDto): Promise<Client> {
    return this.clientsService.createClient(data);
  }

  // UPDATE CLIENT
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'Client successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @Put(':id')
  async updateClient(
    @Param('id') id: number,
    @Body() data: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.updateClient(id, data);
  }

  // FILTER CLIENTS
  @ApiOperation({ summary: 'Search client by filters' })
  @ApiResponse({
    status: 200,
    description: 'Clients found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @Get()
  async getClientByFilters(@Query() filters: ClientFiltersDto): Promise<{
    clients: Client[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const { page, perPage, name, cpf, email, status } = filters;
    return this.clientsService.getClientsByFilters({
      page,
      perPage,
      name,
      cpf,
      email,
      status,
    });
  }

  // SEARCH CLIENTS BY ID
  @ApiOperation({ summary: 'Search a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'Client found',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @Get(':id')
  async getClientById(@Param('id') id: number): Promise<Client> {
    return this.clientsService.getClientById(id);
  }

  // DELETE CLIENT
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({
    status: 200,
    description: 'Client successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @Delete(':id')
  async deleteClient(@Param('id') id: number): Promise<{ message: string }> {
    await this.clientsService.deleteClient(id);
    return { message: 'Client successfully deleted' };
  }
}
