import { CarItem } from '@prisma/client';

export class CarItemEntity implements CarItem {
  name: string;
  id: number;
  carId: number;
}
