import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateClientDto } from "./dtos/create-client.dto";
import { ClientsRepository } from "./repository/client.repository";
import { UpdateClientDto } from "./dtos/update-client.dto";
import { Client } from "@prisma/client";

@Injectable()
export class ClientsService {
	constructor(private readonly repository: ClientsRepository) {}

	async createClient(data: CreateClientDto): Promise<Client> {
		const client = await this.repository.findClientByCpfOrEmail(
			data.cpf,
			data.email
		);

		const age = this.idade(data.birthDate);

		if (client) {
			if (client.cpf === data.cpf) {
				throw new BadRequestException("A client with this CPF already exists.");
			}
			if (client.email === data.email) {
				throw new BadRequestException(
					"A client with this Email already exists."
				);
			}
		}

		if (!age) {
			throw new BadRequestException("Must be 18 years or older");
		}
		return this.repository.createClient(data);
	}

	async getClientById(id: number): Promise<Client | null> {
		const client = await this.repository.findClientById(id);

		if (!client) {
			throw new NotFoundException("Client not found");
		}

		return client;
	}

	async updateClient(id: number, data: UpdateClientDto): Promise<Client> {
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

	//	TO DO: caso tenha pedidos em aberto, negar a inativação.
	async deleteClient(id: number): Promise<Client> {
		const client = await this.repository.findClientById(id);
		if (client.status === false) {
			throw new NotFoundException("Client not found");
		}

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
		return this.repository.getClientsByFilters({
			page,
			perPage,
			name,
			cpf,
			email,
			status,
		});
	}

	idade(birthDate: Date): boolean {
		let date = new Date();
		const age = date.getFullYear() - birthDate.getFullYear();
		return age > 18;
	}
}
