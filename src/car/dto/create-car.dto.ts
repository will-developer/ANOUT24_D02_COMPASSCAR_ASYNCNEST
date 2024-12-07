import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  Max,
  ArrayMinSize,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { CreateCarItemDto } from './create-carItem.dto';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty({ message: 'Brand is required.' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'Model is required.' })
  model: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]{3}-[0-9][A-Ja-j0-9][0-9]{2}$/, {
    message: 'The plate must be in the correct format, for example: ABC-1D23.',
  })
  plate: string;

  @IsInt()
  @IsNotEmpty()
  @Min(new Date().getFullYear() - 10, {
    message: 'The car must be at most 10 years old.',
  })
  @Max(new Date().getFullYear() + 1, {
    message: 'The car year cannot be in the future.',
  })
  year: number;

  @IsInt()
  @Min(0, { message: 'Kilometers must be greater than or equal to 0.' })
  km: number;

  @IsNumber()
  @Min(0.01, { message: 'Daily price must be greater than 0.' })
  dailyPrice: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one item must be provided.' })
  @ArrayMaxSize(5, { message: 'A maximum of five items must be provided.' })
  items: CreateCarItemDto[];
}
