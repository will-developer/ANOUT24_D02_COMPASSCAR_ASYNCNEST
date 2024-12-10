import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService(process.env);
const databaseUrl = configService.get('DATABASE_URL');
const prisma = new PrismaService({datasources: {db: {url: databaseUrl}}});

async function main() {
  const defaultEmail = configService.get('DEFAULT_USER_EMAIL') || 'admin@admin.com';
  const defaultName = configService.get('DEFAULT_USER_NAME') || 'admin';
  const defaultPassword = configService.get('DEFAULT_USER_PASSWORD') || '12345678';

  const existingUser = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await prisma.user.create({
      data: {
        email: defaultEmail,
        name: defaultName,
        password: hashedPassword,
      },
    });

    console.log('Default user created successfully');
  } else {
    console.log('Default user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 