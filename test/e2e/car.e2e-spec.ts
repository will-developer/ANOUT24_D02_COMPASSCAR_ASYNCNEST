import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CanActivate, INestApplication } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from '../../src/auth/infrastructure/guards/jwt-auth.guard';
import { CreateCarDto } from '../../src/car/dto/create-car.dto';
import { OrderController } from '../../src/order/repository/order.controller';
import { OrderService } from '../../src/order/repository/order.service';
import { mockPrismaService } from './mock-prisma.service';

describe('CarService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const MockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [OrderController],
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await prisma.carItem.deleteMany();
    await prisma.car.deleteMany();
    await prisma.client.deleteMany();

    await app.init();
  });

  afterAll(async () => {
    await prisma.carItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.client.deleteMany();

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

    it('should date and status active in create', async () => {
      const createCarDtoComplete = {
        ...CreateCarDto,
        status: true,
        createdAt: new Date(),
      };
      await request(app.getHttpServer())
        .post('/car')
        .send(createCarDtoComplete)
        .expect(400);
    });
  });

  describe('Validation errors for items', () => {
    it('should return an error if items contain duplicates', async () => {
      const payload = {
        brand: 'Jeep',
        model: 'Compass',
        plate: 'BBB-1234',
        year: 2020,
        km: 10000,
        dailyPrice: 200,
        items: [{ name: 'GPS' }, { name: 'GPS' }],
      };

      await request(app.getHttpServer())
        .post('/car')
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Items and accessories cannot be duplicated.',
          );
        });
    });

    it('should return an error if no items are provided', async () => {
      const payload = {
        brand: 'Jeep',
        model: 'Compass',
        plate: 'XBA-1234',
        year: 2020,
        km: 10000,
        dailyPrice: 200,
        items: [],
      };

      await request(app.getHttpServer())
        .post('/car')
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'At least one item must be provided.',
          );
        });
    });

    it('should return an error if more than five items are provided', async () => {
      const payload = {
        brand: 'Jeep',
        model: 'Compass',
        plate: 'ABZ-1234',
        year: 2020,
        km: 10000,
        dailyPrice: 200,
        items: [
          { name: 'GPS' },
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'D' },
          { name: 'E' },
        ],
      };

      await request(app.getHttpServer())
        .post('/car')
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'A maximum of five items must be provided.',
          );
        });
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

  describe('Update Car - Optional Fields', () => {
    it('should return an error if the model is missing when brand is updated', async () => {
      const updateCarDto = {
        brand: 'Jeep',
        model: '',
      };

      await request(app.getHttpServer())
        .patch('/car/1')
        .send(updateCarDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Model is required.');
        });
    });

    it('should successfully update the car when valid fields are provided', async () => {
      const createdCar = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'ADX-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });

      const updateCarDto = {
        brand: 'Fiat',
        model: 'Uno',
        km: 12000,
        dailyPrice: 180,
      };

      await request(app.getHttpServer())
        .patch(`/car/${createdCar.id}`)
        .send(updateCarDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.brand).toBe('Fiat');
          expect(res.body.model).toBe('Uno');
          expect(res.body.km).toBe(12000);
          expect(res.body.dailyPrice).toBe(180);
        });
    });

    it('should return an error if the car does not exist', async () => {
      const updateCarDto = {
        brand: 'Ford',
        model: 'Fusion',
      };

      await request(app.getHttpServer())
        .patch('/car/9999')
        .send(updateCarDto)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Car not found');
        });
    });

    it('should not allow changing the car status', async () => {
      const createdCar = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'XDX-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });

      const updateCarDto = {
        brand: 'Fiat',
        model: 'Uno',
        status: false,
      };

      await request(app.getHttpServer())
        .patch(`/car/${createdCar.id}`)
        .send(updateCarDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'It is not possible to change a car with inactive status',
          );
        });
    });

    it('should update the car and save the update date', async () => {
      const createdCar = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'XDD-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });

      const updateCarDto = {
        brand: 'Honda',
        model: 'Civic',
      };

      const beforeUpdate = new Date();

      await request(app.getHttpServer())
        .patch(`/car/${createdCar.id}`)
        .send(updateCarDto)
        .expect(200)
        .expect((res) => {
          expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(
            beforeUpdate.getTime(),
          );
          expect(res.body.brand).toBe('Honda');
          expect(res.body.model).toBe('Civic');
        });
    });
  });

  describe('GET /car valid cases', () => {
    it('should list cars paginated', async () => {
      await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DBB-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });

      await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DAA-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });
      await request(app.getHttpServer())
        .get(`/car?page=1&limit=2`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBe(2);
        });
    });

    it('should filter cars by brand', async () => {
      await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DCC-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });
      await request(app.getHttpServer())
        .get('/car?brand=Test Brand')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].brand).toContain('Test Brand');
        });
    });

    it('should filter cars by km', async () => {
      await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DDD-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });
      await request(app.getHttpServer())
        .get('/car?km=10000')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].km).toBeLessThanOrEqual(10000);
        });
    });

    it('should filter cars by year', async () => {
      await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DEE-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });
      await request(app.getHttpServer())
        .get('/car?year=2020')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].year).toBeGreaterThanOrEqual(2020);
        });
    });

    it('should filter cars by status true', async () => {
      await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DFF-1234',
          year: 2020,
          km: 10000,
          status: true,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });

      await request(app.getHttpServer())
        .get('/car?status=active')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].status).toBe(true);
        });
    });

    it('should filter cars by status false', async () => {
      const car = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'BAC-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });

      await request(app.getHttpServer()).delete(`/car/${car.id}`).expect(200);

      const updatedCar = await prisma.car.findUnique({
        where: { id: car.id },
      });

      expect(updatedCar.status).toBe(false);
      expect(updatedCar.inactivatedAt).toBeDefined();

      await request(app.getHttpServer())
        .get('/car?status=false')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('should filter cars by daily price', async () => {
      await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DHH-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });
      await request(app.getHttpServer())
        .get('/car?dailyPrice=150')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].dailyPrice).toBeLessThanOrEqual(150);
        });
    });
  });

  describe('GET /car/:id', () => {
    it('should return a car by ID (active or inactive)', async () => {
      const car = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'DII-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
          items: {
            create: [{ name: 'Air Conditioning' }, { name: 'GPS' }],
          },
        },
      });
      const response = await request(app.getHttpServer())
        .get(`/car/${car.id}`)
        .expect(200);

      expect(response.body.id).toBe(car.id);
      expect(response.body.brand).toBe('Test Brand');
      expect(response.body.model).toBe('Test Model');
      expect(response.body.plate).toBe('DII-1234');
      expect(response.body.km).toBe(10000);
      expect(response.body.dailyPrice).toBe(150);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].name).toBe('Air Conditioning');
      expect(response.body.items[1].name).toBe('GPS');
    });

    it('should return an error if the car is not found', async () => {
      await request(app.getHttpServer())
        .get('/car/999999')
        .expect(404)
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.message).toBe('Car not found');
          expect(res.body.error).toBe('Not Found');
        });
    });
  });

  describe('CarController (e2e) - DELETE /car/:id', () => {
    it('should delete a car and set its status to inactive', async () => {
      const car = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'ABC1234',
          year: 2020,
          km: 10000,
          dailyPrice: 150,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/car/${car.id}`)
        .expect(200);

      expect(response.body.message).toBe(
        `The car with the plate: ${car.plate} has been deleted`,
      );

      const updatedCar = await prisma.car.findUnique({
        where: { id: car.id },
      });

      expect(updatedCar.status).toBe(false);
      expect(updatedCar.inactivatedAt).toBeDefined();
    });

    it('should return an error if the car is not found', async () => {
      await request(app.getHttpServer())
        .delete('/car/999999')
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.message).toBe('Car not found');
          expect(res.body.error).toBe('Not Found');
        });
    });

    it('should not delete a car if it is part of an open or approved order', async () => {
      const car = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'XXB-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 50,
        },
      });

      const client = await prisma.client.create({
        data: {
          name: 'teste',
          cpf: '09977517037',
          birthDate: '2000-01-01T00:00:00.000Z',
          email: 'claudiaraia@gmail.com',
          phone: '13999999999',
        },
      });

      const order = await prisma.order.create({
        data: {
          client: {
            connect: {
              id: client.id,
            },
          },
          car: {
            connect: {
              id: car.id,
            },
          },
          startDate: new Date(),
          endDate: new Date(),
          cep: '01310-930',
          statusOrder: 'open',
          uf: 'SP',
          city: 'São Paulo',
          rentalFee: 100,
          totalAmount: 150,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/car/${car.id}`)
        .expect(400);

      expect(response.body.message).toBe(
        'It is not possible to delete this car because it is part of an open order, see the order table',
      );
    });

    it('should not delete a car if it is part of an open or approved order', async () => {
      const car = await prisma.car.create({
        data: {
          brand: 'Test Brand',
          model: 'Test Model',
          plate: 'XXA-1234',
          year: 2020,
          km: 10000,
          dailyPrice: 50,
        },
      });

      const client = await prisma.client.create({
        data: {
          name: 'teste',
          cpf: '740.557.103-48',
          birthDate: '2000-01-01T00:00:00.000Z',
          email: 'claudia_raia@gmail.com',
          phone: '13999999999',
        },
      });

      await prisma.order.create({
        data: {
          client: {
            connect: {
              id: client.id,
            },
          },
          car: {
            connect: {
              id: car.id,
            },
          },
          startDate: new Date(),
          endDate: new Date(),
          cep: '01310-930',
          statusOrder: 'approved',
          uf: 'SP',
          city: 'São Paulo',
          rentalFee: 100,
          totalAmount: 150,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/car/${car.id}`)
        .expect(400);

      expect(response.body.message).toBe(
        'It is not possible to delete this car because it is part of an open order, see the order table',
      );
    });
  });
});
