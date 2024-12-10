import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsCpf } from '../decorators/is-cpf.decorator';

// all fields are optional

export class UpdateClientDto {
  @ApiProperty({
    description: "Customer's full name",
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Customer's CPF",
    example: '74836512894',
  })
  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'CPF must contain exactly 11 digits' })
  @Validate(IsCpf)
  cpf?: string;

  @ApiProperty({
    description: "Customer's date of birth",
    example: '1994-01-01',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({
    description: "Customer's e-mail",
    example: 'john@mail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "Customer's phone number",
    example: '11123456789',
  })
  @IsOptional()
  @MinLength(10)
  @MaxLength(11)
  phone?: string;
}
