import { IsEmail, IsOptional, Matches, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'the password must contain at least 8 characters, including letters and numbers.',
  })
  password?: string;
}
