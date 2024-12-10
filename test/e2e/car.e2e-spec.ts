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

  const invalidPayloads = [
    { field: 'brand', value: '', message: 'Brand is required.' },
    { field: 'model', value: '', message: 'Model is required.' },
    {
      field: 'plate',
      value: '',
      message: [
        'The plate must be in the correct format, for example: ABC-1D23.',
        'plate should not be empty',
      ],
    },
    {
      field: 'km',
      value: -10,
      message: 'Kilometers must be greater than or equal to 0.',
    },
    {
      field: 'dailyPrice',
      value: 0,
      message: 'Daily price must be greater than 0.',
    },
  ];

  describe('Validation errors', () => {
    invalidPayloads.forEach(({ field, value, message }) => {
      it(`should return an error if ${field} is invalid`, async () => {
        const payload = {
          brand: 'Jeep',
          model: 'Compass',
          plate: 'XBC-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 200,
          items: ['Air Conditioning', 'Baby-Seat'],
        };

        payload[field] = value;

        await request(app.getHttpServer())
          .post('/car')
          .send(payload)
          .expect(400)
          .expect((res) => {
            if (Array.isArray(message)) {
              expect(res.body.message).toEqual(expect.arrayContaining(message));
            } else {
              expect(res.body.message).toContain(message);
            }
          });
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
