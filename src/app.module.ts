import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClientsModule } from './clients/clients.module';

@Module({
	controllers: [AppController],
	providers: [AppService],
	imports: [ClientsModule],
})
export class AppModule {}
