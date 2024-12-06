import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body(new ValidationPipe()) dto: CreateUserDTO) {
        return this.usersService.createUser(dto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body(new ValidationPipe()) dto: UpdateUserDTO) {
        return this.usersService.updateUser(+id, dto);
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return this.usersService.findById(+id);
    }

    @Delete(':id')
    async delete (@Param ('id') id:number){
        return this.usersService.inativateUser(+id);
    }

}
