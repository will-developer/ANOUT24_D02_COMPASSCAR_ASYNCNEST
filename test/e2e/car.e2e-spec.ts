import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CanActivate, INestApplication } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from '../../src/auth/infrastructure/guards/jwt-auth.guard';

describe('CarService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const MockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await prisma.carItem.deleteMany();
    await prisma.car.deleteMany();

    await app.init();
  });

  afterAll(async () => {
    await prisma.carItem.deleteMany();
    await prisma.car.deleteMany();
    await app.close();
  });

  const createCarDto = {
    brand: 'Jeep',
    model: 'Compass',
    plate: `ABX-1234`,
    year: 2020,
    km: 10000,
    dailyPrice: 200,
    items: [{ name: 'Air Conditioning' }, { name: 'Baby-Seat' }],
  };

  describe('POST /car valid cases', () => {
    it('should create a car valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/car')
        .send(createCarDto)
        .expect(201);

      expect(response.body).toHaveProperty('brand');
      expect(response.body).toHaveProperty('model');
      expect(response.body).toHaveProperty('plate');
      expect(response.body).toHaveProperty('year');
      expect(response.body).toHaveProperty('km');
      expect(response.body).toHaveProperty('dailyPrice');
      expect(response.body).toHaveProperty('items');
    });
  });

  describe('All fields are required', () => {
    it('should return an error if brand is empty', async () => {
      const createCarDto1 = {
        brand: '',
        model: 'Compass',
        plate: 'XBC-1234',
        year: 2020,
        km: 10000,
        dailyPrice: 200,
        items: ['Air Conditioning', 'Baby-Seat'],
      };

      await request(app.getHttpServer())
        .post('/car')
        .send(createCarDto1)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Brand is required.');
        });
    });
  });

  describe('POST /car invalid cases', () => {
    it('should not create new car if plate is used for other car', async () => {
      const createCarDto1 = {
        brand: 'Jeep',
        model: 'Compass',
        plate: `ABC-1444`,
        year: 2020,
        km: 10000,
        dailyPrice: 200,
        items: [{ name: 'Air Conditioning' }, { name: 'Baby-Seat' }],
      };

      const createCarDto2 = {
        brand: 'Fiat',
        model: 'Uno',
        plate: `ABC-1444`,
        year: 2020,
        km: 10000,
        dailyPrice: 200,
        items: [{ name: 'Air Conditioning' }, { name: 'Baby-Seat' }],
      };

      await request(app.getHttpServer())
        .post('/car')
        .send(createCarDto1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/car')
        .send(createCarDto2)
        .expect(400);
    });
  });
});
