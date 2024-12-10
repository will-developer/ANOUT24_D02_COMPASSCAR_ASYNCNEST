import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';

describe('Client Module (e2e)', () => {
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
    prisma = moduleFixture.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new client', async () => {
    const clientData = {
      name: 'John Doe',
      cpf: '74836512894',
      birthDate: '2000-01-01T00:00:00.000Z',
      email: 'john@mail.com',
      phone: '11123456789',
    };

    const response = await request(app.getHttpServer())
      .post('/client')
      .send(clientData)
      .expect(201);

    expect(response.body.name).toBe(clientData.name);
    expect(response.body.cpf).toBe(clientData.cpf);
    expect(response.body.email).toBe(clientData.email);
  });

  it('should get a client by id', async () => {
    const clientData = {
      name: 'John Doe',
      cpf: '74836512894',
      birthDate: '2000-01-01T00:00:00.000Z',
      email: 'john@mail.com',
      phone: '11123456789',
    };

    const createdClient = await request(app.getHttpServer())
      .post('/client')
      .send(clientData)
      .expect(201);

    const clientId = createdClient.body.id;

    const response = await request(app.getHttpServer())
      .get(`/client/${clientId}`)
      .expect(200);

    expect(response.body.name).toBe(clientData.name);
    expect(response.body.cpf).toBe(clientData.cpf);
    expect(response.body.email).toBe(clientData.email);
  });

  it('should get a client by filters', async () => {
    const clientData = {
      name: 'John Doe',
      cpf: '74836512894',
      birthDate: '2000-01-01T00:00:00.000Z',
      email: 'john@mail.com',
      phone: '11123456789',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/client')
      .send(clientData)
      .expect(201);

    expect(createResponse.body.name).toBe(clientData.name);
    expect(createResponse.body.cpf).toBe(clientData.cpf);
    expect(createResponse.body.email).toBe(clientData.email);

    const filters = {
      page: 1,
      perPage: 10,
      name: 'John',
      cpf: '74836512894',
      email: 'john@mail.com',
      status: 'active',
    };

    const response = await request(app.getHttpServer())
      .get('/client')
      .query(filters)
      .expect(200);

    expect(response.body.clients).toBeInstanceOf(Array);
    expect(response.body.clients.length).toBeGreaterThan(0);
    expect(response.body.clients[0].name).toBe(clientData.name);
    expect(response.body.clients[0].cpf).toBe(clientData.cpf);
    expect(response.body.clients[0].email).toBe(clientData.email);
  });

  it('should update a client', async () => {
    const clientData = {
      name: 'John Doe',
      cpf: '74836512894',
      birthDate: '2000-01-01T00:00:00.000Z',
      email: 'john@mail.com',
      phone: '11123456789',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/client')
      .send(clientData)
      .expect(201);

    const clientId = createResponse.body.id;

    const updatedData = {
      name: 'John Updated',
      email: 'john.updated@mail.com',
    };

    const updateResponse = await request(app.getHttpServer())
      .put(`/client/${clientId}`)
      .send(updatedData)
      .expect(200);

    expect(updateResponse.body.name).toBe(updatedData.name);
    expect(updateResponse.body.email).toBe(updatedData.email);
    expect(updateResponse.body.cpf).toBe(clientData.cpf); //
  });

  it('should delete a client', async () => {
    const clientData = {
      name: 'John Doe',
      cpf: '74836512894',
      birthDate: '2000-01-01T00:00:00.000Z',
      email: 'john@mail.com',
      phone: '11123456789',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/client')
      .send(clientData)
      .expect(201);

    const clientId = createResponse.body.id;

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/client/${clientId}`)
      .expect(200);

    expect(deleteResponse.body.message).toBe('Client successfully deleted');

    const clientFromDb = await prisma.client.findUnique({
      where: { id: clientId },
    });

    expect(clientFromDb.status).toBe(false);
  });
});
