import { IsString } from 'class-validator';

export class CreateCarItemDto {
  @IsString()
  name: string;
}
