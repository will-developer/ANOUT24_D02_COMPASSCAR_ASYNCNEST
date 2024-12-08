import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';


export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name of a user', type: String, example: 'John Doe' })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'email', example: 'john.doe@gmail.com' })
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
        message: 'password must contain at least 8 characters, including letters and numbers',
      })
    @ApiProperty({ description: 'password', example: 'password123' })
    password: string;
}