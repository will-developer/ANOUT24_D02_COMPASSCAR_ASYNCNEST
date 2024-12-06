import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
          throw new BadRequestException('user already registered.');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        try {
            return this.userRepository.create({
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
                
        } catch (error) {
            throw new InternalServerErrorException();
        }
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

        try {
          return this.userRepository.update(id, {
            ...dto,
            updatedAt: new Date(),
          }); 
        } catch (error) {
          throw new InternalServerErrorException();
        }
    }

    async findById(id: number){
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException('user not found.');

        const { password, ...userWithoutPassword } = user;

        try {
          return userWithoutPassword;
          
        } catch (error) {
          throw new InternalServerErrorException();
        } 
    }

    async inativateUser (id:number){
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException('user not found.');

        try {
          return this.userRepository.update(id, {
            status: false, 
            inativedAt: new Date()
          });
          
        } catch (error) {
          throw new InternalServerErrorException();     
        }
        
    }

}
