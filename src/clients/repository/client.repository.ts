import { Injectable } from "@nestjs/common";
import { CreateClientDto } from "../dtos/create-client.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateClientDto } from "../dtos/update-client.dto";

@Injectable()
export class ClientsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createClient(data: CreateClientDto) {
		return this.prisma.client.create({ data });
	}

	async findClientByCpfOrEmail(cpf?: string, email?: string) {
		const entryValue = [];
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

	async findClientById(id: number) {
		return this.prisma.client.findUnique({
			where: {
				id,
			},
		});
	}

	async updateClient(id: number, data: UpdateClientDto) {
		return this.prisma.client.update({
			where: { id },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});
	}

	async deleteClient(id: number) {
		return this.prisma.client.update({
			where: { id },
			data: {
				status: false,
				inativatedAt: new Date(),
			},
		});
	}
}
