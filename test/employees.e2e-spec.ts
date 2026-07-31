import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/infra/prisma/prisma.service';
import { AllExceptionsFilter } from './../src/shared/filters/all-exceptions.filter';

describe('EmployeesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prisma = app.get(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.employee.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/employees (POST)', () => {
    it('deve criar um colaborador e retornar HTTP 201', async () => {
      const payload = {
        name: 'Jane Doe',
        email: 'jane.doe@inmeta.com',
      };

      const response = await request(app.getHttpServer())
        .post('/employees')
        .send(payload)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(payload.name);
      expect(response.body.email).toBe(payload.email);
    });

    it('deve retornar HTTP 409 se o e-mail já existir', async () => {
      const payload = {
        name: 'Jane Doe',
        email: 'jane.doe@inmeta.com',
      };

      await request(app.getHttpServer()).post('/employees').send(payload);

      const response = await request(app.getHttpServer())
        .post('/employees')
        .send(payload)
        .expect(409);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'Já existe um colaborador cadastrado com este e-mail.',
        ]),
      );
    });

    it('deve retornar HTTP 400 se o e-mail for inválido', async () => {
      const payload = {
        name: 'Jane Doe',
        email: 'email_invalido',
      };

      const response = await request(app.getHttpServer())
        .post('/employees')
        .send(payload)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining(['O e-mail fornecido é inválido.']),
      );
    });
  });
});
