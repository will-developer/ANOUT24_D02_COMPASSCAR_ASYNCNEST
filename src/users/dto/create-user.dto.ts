import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, Matches } from 'class-validator';


export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
        message: 'password must contain at least 8 characters, including letters and numbers',
      })
    password: string;
}