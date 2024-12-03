//import { Car } from '@prisma/client'

export class Car /*implements Car*/ {
  id: number;
  brand: string;
  model: string;
  plate: string;
  year: number;
  kilometers: number;
  dailyPrice: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  inativatedAt?: Date | null;
  // items: CarItem[]
  // orders: Order[]
}
