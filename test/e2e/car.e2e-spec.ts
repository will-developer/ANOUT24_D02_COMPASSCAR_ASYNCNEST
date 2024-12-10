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

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const createCarDto = {
    brand: 'Jeep',
    model: 'Compass',
    plate: `${Date.now()}`,
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
});
