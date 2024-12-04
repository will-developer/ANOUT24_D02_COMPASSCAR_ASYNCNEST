import {
	BadRequestException,
	ConflictException,
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
		const client = await this.repository.findClientByCpfOrEmail(
			data.cpf,
			data.email
		);

		if (client) {
			if (client.cpf === data.cpf) {
				throw new BadRequestException("A client with this CPF already exists.");
			}
		}

		if (client) {
			if (client.email === data.email) {
				throw new BadRequestException(
					"A client with this Email already exists."
				);
			}
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

	async updateClient(id: number, data: UpdateClientDto) {
		// check if the client exists in database
		const client = await this.repository.findClientById(id);
		if (!client) {
			throw new NotFoundException("Client not found");
		}

		// check if the new cpf already exists in database
		if (data.cpf && data.cpf !== client.cpf) {
			const cpfExists = await this.repository.findClientByCpfOrEmail(
				data.cpf,
				null
			);
			if (cpfExists) {
				throw new ConflictException("A client with this CPF already exists.");
			}
		}

		// check if the new email already exists in database
		if (data.email && data.email !== client.email) {
			const emailExists = await this.repository.findClientByCpfOrEmail(
				null,
				data.email
			);
			if (emailExists) {
				throw new ConflictException("A client with this email already exists.");
			}
		}

		// If it passes the validations, it updates the database with the new data
		const updatedClient = await this.repository.updateClient(id, {
			...data,
		});

		return updatedClient;
	}
}
