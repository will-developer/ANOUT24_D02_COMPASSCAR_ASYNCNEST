import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository) {}
    
    async createUser(dto: CreateUserDTO){
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser && existingUser.status) {
          throw new BadRequestException('e-mail already registered.');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            status: true,
            createdAt: new Date(),
        });

    }
}
