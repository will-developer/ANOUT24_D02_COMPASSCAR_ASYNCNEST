import { Car } from '@prisma/client';

export class CarEntity implements Car {
  id: number;
  brand: string;
  model: string;
  plate: string;
  year: number;
  km: number;
  dailyPrice: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  inactivatedAt: Date;
}
//todo: precisará integrar junto com a entidade de Orders
