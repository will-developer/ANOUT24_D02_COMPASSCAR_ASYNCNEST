import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async create(@Body() dto: CreateUserDTO) {
        return this.usersService.createUser(dto);
    }

   
    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateUserDTO) {
        return this.usersService.updateUser(+id, dto);
    }

}
