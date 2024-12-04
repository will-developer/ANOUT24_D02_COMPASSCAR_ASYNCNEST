import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
//import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createClient({ name, cpf, birthDate, email, phone }: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        name,
        cpf,
        birthDate: new Date(new Date(birthDate).setHours(0, 0, 0, 0)),
        email,
        phone,
      },
    });
  }

  /*findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, data: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }*/
}
