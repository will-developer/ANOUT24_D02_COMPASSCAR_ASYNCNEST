import { PartialType } from '@nestjs/mapped-types';
import { CreateCarItemDto } from './create-carItem.dto';

export class UpdateCarItemDto extends PartialType(CreateCarItemDto) {}
