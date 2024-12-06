import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { ClientsRepository } from "./repository/client.repository";

@Module({
	imports: [PrismaModule],
	controllers: [ClientsController],
	providers: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
