import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL'),
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async cleanDatabase() {
        const models = Reflect.ownKeys(this).filter(key => {
            return typeof key === 'string' && 
                   !key.startsWith('_') && 
                   !['$connect', '$disconnect', '$on', '$transaction', '$use'].includes(key);
        });
    
        return await this.$transaction(
            models.map(modelKey => this[modelKey as string].deleteMany())
        );
    }
}