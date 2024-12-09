import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'Password',
  })
  password: string;
}
