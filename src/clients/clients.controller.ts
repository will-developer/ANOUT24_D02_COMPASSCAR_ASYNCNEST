import { Body, Controller, Post } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dtos/create-client.dto";

@Controller("clients")
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Post()
	async createClient(@Body() data: CreateClientDto) {
		return this.clientsService.createClient(data);
	}
}
