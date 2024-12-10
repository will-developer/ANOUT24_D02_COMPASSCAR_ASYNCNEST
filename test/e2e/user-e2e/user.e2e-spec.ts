import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppModule } from 'src/app.module';

describe('UsersService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new user', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(createUserDto.name);
    expect(response.body.email).toBe(createUserDto.email);

    const isPasswordEncrypted = await bcrypt.compare(
      createUserDto.password,
      response.body.password,
    );

    expect(isPasswordEncrypted).toBe(true);
  });

  it('should return a list of users', async () => {
    const createUserDto = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer()).post('/users').send(createUserDto);

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return user by id without password', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const userId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should update an existing user', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const userId = createResponse.body.id;

    const updateUserDto = {
      name: 'John Doe Updated',
      email: 'john.doe.updated@example.com',
      password: 'newpassword123',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updateUserDto)
      .expect(200);

    expect(updateResponse.body.name).toBe(updateUserDto.name);
    expect(updateResponse.body.email).toBe(updateUserDto.email);
  });

  it('should not allow duplicate email on update', async () => {
    const createUserOneDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    const createUserTwoDTO = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
    };

    const createResponseUserOne = await request(app.getHttpServer())
      .post('/users')
      .send(createUserOneDTO)
      .expect(201);

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserTwoDTO)
      .expect(201);

    const userId = createResponseUserOne.body.id;

    const updateUserDto = {
      email: 'jane.doe@example.com',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updateUserDto)
      .expect(400);

    expect(updateResponse.body.message).toBe('email already registered.');
  });

  it('should throw error if user not found for update', async () => {
    const updateUserDto = {
      name: 'Nonexistent User',
    };

    const response = await request(app.getHttpServer())
      .patch('/users/999999')
      .send(updateUserDto)
      .expect(404);

    expect(response.body.message).toBe('user not found.');
  });

  it('should throw error if user not found for update', async () => {
    const updateUserDto = {
      name: 'Nonexistent User',
    };

    const response = await request(app.getHttpServer())
      .patch('/users/999999')
      .send(updateUserDto)
      .expect(404);

    expect(response.body.message).toBe('user not found.');
  });
});
