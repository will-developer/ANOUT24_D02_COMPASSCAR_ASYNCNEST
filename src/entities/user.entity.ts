export class UserEntity {
  id: number;
  name: string;
  email: string;
  password?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  inactivatedAt?: Date;
}
