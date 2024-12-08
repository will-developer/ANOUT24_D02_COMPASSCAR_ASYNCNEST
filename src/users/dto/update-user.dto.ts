import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @ApiProperty({ description: 'name of a user', type: String, example: 'John Doe'})
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: 'email of a user', example: 'john.doe@gmail.com'})
  email?: string;

  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'the password must contain at least 8 characters, including letters and numbers.',
  })
  @ApiProperty({ description: 'password of a user', example: 'password123'})
  password?: string;
}
