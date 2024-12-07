import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: "Customer's full name",
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Customer's CPF",
    example: '123.456.789-10',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{3}(\.\d{3}){2}-\d{2}$|^\d{11}$/, {
    message:
      'CPF must have 11 digits and be in the following formats: 12345678910 or 123.456.789-10',
  })
  cpf: string;

  @ApiProperty({
    description: "Customer's date of birth",
    example: '1994-01-01',
  })
  @IsNotEmpty()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({
    description: "Customer's e-mail",
    example: 'john@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Customer's phone number",
    example: '(11) 12345-6789',
  })
  @IsNotEmpty()
  @Matches(/^\(\d{2}\)\s?\d{5}-\d{4}$/, {
    message: 'Phone must be in format: (11) 12345-6789',
  })
  phone: string;
}
