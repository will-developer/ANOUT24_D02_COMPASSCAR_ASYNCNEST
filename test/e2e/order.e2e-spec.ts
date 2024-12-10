import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../src/order/repository/order.controller';
import { OrderService } from '../../src/order/repository/order.service';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { axiosMock } from './mock-axios';
import axios from 'axios';

jest.mock('axios');

describe('OrderController (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService, PrismaService],
    })
      .overrideProvider(axios)
      .useValue(axiosMock)
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);
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

    const car = await prismaService.car.create({
      data: {
        id: 1,
        dailyPrice: 100,
        status: true,
      },
    });

    const client = await prismaService.client.create({
      data: {
        id: 1,
        status: true,
      },
    });

    const createdOrder = await prismaService.order.create({
      data: {
        clientId: client.id,
        carId: car.id,
        startDate: new Date(),
        endDate: new Date(),
        cep: '01310-930',
        rentalFee: 10.04,
        totalAmount: 10.04,
        statusOrder: 'open',
      },
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

    const car = await prismaService.car.create({
      data: {
        id: 1,
        status: false,
      },
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
    await prismaService.order.create({
      data: {
        clientId: 1,
        carId: 1,
        startDate: new Date(),
        endDate: new Date(),
        cep: '01310-930',
        rentalFee: 10.04,
        totalAmount: 100,
        statusOrder: 'open',
      },
    });

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

    const order = await prismaService.order.create({
      data: {
        clientId: 1,
        carId: 1,
        startDate: new Date(),
        endDate: new Date(),
        cep: '01310-930',
        rentalFee: 10.04,
        totalAmount: 100,
        statusOrder: 'open',
      },
    });

    const car = await prismaService.car.create({
      data: {
        id: 1,
        dailyPrice: 100,
        status: true,
      },
    });

    axiosMock.get.mockResolvedValue({
      data: {
        localidade: 'São Paulo',
        uf: 'SP',
        gia: '1004',
      },
    });

    const updatedOrder = await prismaService.order.update({
      where: { id: order.id },
      data: { ...updateOrderDto, statusOrder: 'approved' },
    });

    return request(app.getHttpServer())
      .put(`/orders/${order.id}`)
      .send(updateOrderDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.statusOrder).toBe('approved');
      });
  });

  it('should fail when trying to cancel a non-open order', async () => {
    const order = await prismaService.order.create({
      data: {
        clientId: 1,
        carId: 1,
        startDate: new Date(),
        endDate: new Date(),
        cep: '01310-930',
        rentalFee: 10.04,
        totalAmount: 100,
        statusOrder: 'approved',
      },
    });

    await request(app.getHttpServer())
      .delete(`/orders/${order.id}`)
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Only open orders can be cancelled',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
