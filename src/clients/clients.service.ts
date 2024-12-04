import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateClientDto } from "./dtos/create-client.dto";
import { ClientsRepository } from "./repository/client.repository";
import { UpdateClientDto } from "./dtos/update-client.dto";

@Injectable()
export class ClientsService {
	constructor(private readonly repository: ClientsRepository) {}

	async createClient(data: CreateClientDto) {
		const { cpfExists, emailExists } =
			await this.repository.findClientByCpfOrEmail(data.cpf, data.email);

		if (cpfExists) {
			throw new BadRequestException("A client with this CPF already exists.");
		}

		if (emailExists) {
			throw new BadRequestException("A client with this Email already exists.");
		}

		return this.repository.createClient(data);
	}

	async getClientById(id: number) {
		const client = await this.repository.findClientById(id);

		if (!client) {
			throw new NotFoundException("Client not found");
		}

		return client;
	}
}
