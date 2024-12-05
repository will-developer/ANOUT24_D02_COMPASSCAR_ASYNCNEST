import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

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

    async updateUser (id: number, dto: UpdateUserDTO){
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException('user not found.');
    
        if (dto.email) {
          const existingUser = await this.userRepository.findByEmail(dto.email);
          if (existingUser && existingUser.id !== id && existingUser.status) {
            throw new BadRequestException('email already registered.');
          }
        }
    
        if (dto.password) {
          dto.password = await bcrypt.hash(dto.password, 10);
        }
    
        return this.userRepository.update(id, {
          ...dto,
          updatedAt: new Date(),
        }); 

    }
}
