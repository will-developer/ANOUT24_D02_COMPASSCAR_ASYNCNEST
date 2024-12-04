import { Injectable } from "@nestjs/common";
import { CreateClientDto } from "../dtos/create-client.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createClient(data: CreateClientDto) {
		return this.prisma.client.create({ data });
	}

	async exists(cpf: string, email: string) {
		const existingClientEmail = await this.prisma.client.findFirst({
			where: {
				email,
				status: true,
			},
		});

		const existingClientCPF = await this.prisma.client.findFirst({
			where: {
				cpf,
				status: true,
			},
		});

		return {
			cpfExists: existingClientCPF !== null,
			emailExists: existingClientEmail !== null,
		};
	}
}
