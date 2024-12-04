import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dtos/create-client.dto";
import { UpdateClientDto } from "./dtos/update-client.dto";

@Controller("clients")
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

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
}
