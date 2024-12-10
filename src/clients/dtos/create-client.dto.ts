import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsCpf } from '../decorators/is-cpf.decorator';

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
    example: '64225307301',
  })
  @IsNotEmpty()
  @IsString()
  @Length(11, 11, { message: 'CPF must contain exactly 11 digits' })
  @Validate(IsCpf)
  cpf: string;

  @ApiProperty({
    description: "Customer's date of birth",
    example: '2000-01-01',
  })
  @IsNotEmpty()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({
    description: "Customer's e-mail",
    example: 'doe@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Customer's phone number",
    example: '11123456789',
  })
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(11)
  phone: string;
}
