import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dtos/create-client.dto";
import { UpdateClientDto } from "./dtos/update-client.dto";
import { ApiResponse } from "@nestjs/swagger";

@Controller("clients")
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@ApiResponse({ status: 400, description: "Dados de entrada inválidos" })
	@ApiResponse({ status: 201, description: "Cliente criado com sucesso" })
	@Post()
	async createClient(@Body() data: CreateClientDto) {
		return this.clientsService.createClient(data);
	}

	@Put(":id")
	async updateClient(@Param("id") id: number, @Body() data: UpdateClientDto) {
		return this.clientsService.updateClient(id, data);
	}

	@Get(":id")
	async getClientById(@Param("id") id: number) {
		return this.clientsService.getClientById(id);
	}

	@Delete(":id")
	async deleteClient(@Param("id") id: number) {
		return this.clientsService.deleteClient(id);
	}

	@Get(":id")
	async idade(@Param("id") id: number) {
		return this.clientsService.idade(id);
	}
}
