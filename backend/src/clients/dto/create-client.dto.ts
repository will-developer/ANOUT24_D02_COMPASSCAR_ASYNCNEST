import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/, {
    message: 'The CPF must contain 11 digits',
  })
  cpf: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'The telephone number must be in the format (11) 98765-4321.',
  })
  phone: string;
}
