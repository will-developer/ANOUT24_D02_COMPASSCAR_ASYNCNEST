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
import { ApiProperty } from '@nestjs/swagger';
import { CreateCarItemDto } from './create-carItem.dto';

export class CreateCarDto {
  @ApiProperty({
    description: 'Brand of the car. This field is required.',
    example: 'Jeep',
  })
  @IsString()
  @IsNotEmpty({ message: 'Brand is required.' })
  brand: string;

  @ApiProperty({
    description: 'Model of the car. This field is required.',
    example: 'Compass',
  })
  @IsString()
  @IsNotEmpty({ message: 'Model is required.' })
  model: string;

  @ApiProperty({
    description:
      'License plate of the car. Format: ABC-1D23 (3 uppercase letters, a hyphen, and a combination of digits and uppercase letters).',
    example: 'ABC-1D23',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]{3}-[0-9][A-Ja-j0-9][0-9]{2}$/, {
    message: 'The plate must be in the correct format, for example: ABC-1D23.',
  })
  plate: string;

  @ApiProperty({
    description:
      'Year the car was manufactured. Must be at most 10 years old and cannot be in the future.',
    example: 2018,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(new Date().getFullYear() - 10, {
    message: 'The car must be at most 10 years old.',
  })
  @Max(new Date().getFullYear() + 1, {
    message: 'The car year cannot be in the future.',
  })
  year: number;

  @ApiProperty({
    description:
      'Number of kilometers driven. Must be greater than or equal to 0.',
    example: 45000,
  })
  @IsInt()
  @Min(0, { message: 'Kilometers must be greater than or equal to 0.' })
  km: number;

  @ApiProperty({
    description: 'Daily rental price of the car. Must be greater than 0.',
    example: 99.99,
  })
  @IsNumber()
  @Min(0.01, { message: 'Daily price must be greater than 0.' })
  dailyPrice: number;

  @ApiProperty({
    description:
      'List of car items. At least one item is required, and a maximum of five items is allowed.',
    example: [
      { name: 'GPS', price: 10 },
      { name: 'Baby seat', price: 20 },
    ],
    type: [CreateCarItemDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one item must be provided.' })
  @ArrayMaxSize(5, { message: 'A maximum of five items must be provided.' })
  items: CreateCarItemDto[];
}
