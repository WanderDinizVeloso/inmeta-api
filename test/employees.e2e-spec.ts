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

  describe('/employees (GET)', () => {
    it('deve listar colaboradores com paginação padrão (page=1, limit=10)', async () => {
      await request(app.getHttpServer())
        .post('/employees')
        .send({ name: 'User 1', email: 'user1@test.com' });
      await request(app.getHttpServer())
        .post('/employees')
        .send({ name: 'User 2', email: 'user2@test.com' });

      const response = await request(app.getHttpServer())
        .get('/employees')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        lastPage: 1,
      });
    });

    it('deve respeitar os limites de paginação via query params', async () => {
      await request(app.getHttpServer())
        .post('/employees')
        .send({ name: 'User 1', email: 'user1@test.com' });
      await request(app.getHttpServer())
        .post('/employees')
        .send({ name: 'User 2', email: 'user2@test.com' });

      const response = await request(app.getHttpServer())
        .get('/employees?page=2&limit=1')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.page).toBe(2);
      expect(response.body.meta.lastPage).toBe(2);
    });
  });

  describe('/employees/:id (DELETE)', () => {
    it('deve remover um colaborador logicamente (Soft Delete) e retornar HTTP 204', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/employees')
        .send({ name: 'Para Deletar', email: 'delete@inmeta.com' });

      const id = createResponse.body.id;

      await request(app.getHttpServer()).delete(`/employees/${id}`).expect(204);

      const listResponse = await request(app.getHttpServer())
        .get('/employees')
        .expect(200);

      expect(listResponse.body.data).toHaveLength(0);
      expect(listResponse.body.meta.total).toBe(0);
    });

    it('deve retornar HTTP 404 ao tentar deletar um ID inexistente', async () => {
      const fakeUuid = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app.getHttpServer())
        .delete(`/employees/${fakeUuid}`)
        .expect(404);

      expect(response.body.message).toEqual(
        expect.arrayContaining(['Colaborador não encontrado ou já removido.']),
      );
    });
  });
});
