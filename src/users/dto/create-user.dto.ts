import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';


export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}