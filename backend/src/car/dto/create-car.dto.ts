import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/, {
    message: 'The plate must be in the correct format, for example: ABC-1D23 .',
  })
  plate: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsInt()
  @Min(0, { message: 'Kilometers must be greater than 0.' })
  km: number;

  @IsNumber()
  @Min(0.01, { message: 'Daily price must be greater than 0.' })
  dailyPrice: number;

  @IsBoolean()
  status: boolean;

  @IsDate()
  inativatedAt?: Date;
}
