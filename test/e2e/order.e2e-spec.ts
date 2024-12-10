import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../src/order/repository/order.controller';
import { OrderService } from '../../src/order/repository/order.service';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';
import { CanActivate, INestApplication } from '@nestjs/common';
import { mockPrismaService } from './mock-prisma.service';
import { axiosMock } from './mock-axios';
import axios from 'axios';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';

jest.mock('axios');

describe('OrderController (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const MockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideProvider(axios)
      .useValue(axiosMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    const createOrderDto = {
      clientId: 1,
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
    };

    axiosMock.get.mockResolvedValue({
      data: {
        localidade: 'São Paulo',
        uf: 'SP',
        gia: '1004',
      },
    });

    mockPrismaService.car.findUnique.mockResolvedValue({
      id: 1,
      dailyPrice: 100,
      status: true,
    });

    mockPrismaService.client.findUnique.mockResolvedValue({
      id: 1,
      status: true,
    });

    mockPrismaService.order.create.mockResolvedValue({
      id: 1,
      ...createOrderDto,
      rentalFee: 10.04,
      totalAmount: 10.04,
      statusOrder: 'open',
    });

    return request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.statusOrder).toBe('open');
      });
  });

  it('should fail when creating order with invalid CEP', async () => {
    const createOrderDto = {
      clientId: 1,
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
    };

    axiosMock.get.mockResolvedValue({ data: { erro: true } });

    return request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe(
          'Error while fetching address from VIACEP',
        );
      });
  });

  it('should fail when car is not available', async () => {
    const createOrderDto = {
      clientId: 1,
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
    };

    axiosMock.get.mockResolvedValue({
      data: {
        localidade: 'São Paulo',
        uf: 'SP',
        gia: '1004',
      },
    });

    mockPrismaService.car.findUnique.mockResolvedValue({
      id: 1,
      status: false,
    });

    return request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Car is not active.');
      });
  });

  it('should list orders with pagination', async () => {
    mockPrismaService.order.findMany.mockResolvedValue([
      {
        id: 1,
        clientId: 1,
        carId: 1,
        startDate: new Date(),
        endDate: new Date(),
        cep: '01310-930',
        rentalFee: 10.04,
        totalAmount: 100,
        statusOrder: 'open',
      },
    ]);

    return request(app.getHttpServer())
      .get('/orders')
      .query({ page: 1, limit: 10 })
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('should update an order successfully', async () => {
    const updateOrderDto = {
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
      statusOrder: 'approved',
    };

    mockPrismaService.order.findUnique.mockResolvedValue({
      id: 1,
      clientId: 1,
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
      statusOrder: 'open',
    });

    mockPrismaService.car.findUnique.mockResolvedValue({
      id: 1,
      dailyPrice: 100,
      status: true,
    });

    axiosMock.get.mockResolvedValue({
      data: {
        localidade: 'São Paulo',
        uf: 'SP',
        gia: '1004',
      },
    });

    mockPrismaService.order.update.mockResolvedValue({
      id: 1,
      statusOrder: 'approved',
      ...updateOrderDto,
    });

    return request(app.getHttpServer())
      .put('/orders/1')
      .send(updateOrderDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.statusOrder).toBe('approved');
      });
  });

  it('should fail when trying to cancel a non-open order', async () => {
    mockPrismaService.order.findUnique.mockResolvedValue({
      id: 1,
      statusOrder: 'approved',
    });

    await request(app.getHttpServer()).delete('/orders/1').expect(400).expect({
      statusCode: 400,
      message: 'Only open orders can be cancelled',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
