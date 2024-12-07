import { PartialType } from '@nestjs/swagger';
import { CreateCarItemDto } from './create-carItem.dto';

export class UpdateCarItemDto extends PartialType(CreateCarItemDto) {}
