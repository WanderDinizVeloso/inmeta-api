import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/infra/prisma/prisma.service';
import { AllExceptionsFilter } from './../src/shared/filters/all-exceptions.filter';

describe('DocumentTypesController (e2e)', () => {
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
    await prisma.documentSubmission.deleteMany();
    await prisma.employeeDocumentRequirement.deleteMany();
    await prisma.documentType.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/document-types (POST)', () => {
    it('deve criar um tipo de documento e retornar HTTP 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/document-types')
        .send({ name: 'ASO', description: 'Atestado de Saúde' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('ASO');
    });

    it('deve retornar HTTP 409 se o nome já existir', async () => {
      const payload = { name: 'ASO', description: 'Atestado' };
      await request(app.getHttpServer()).post('/document-types').send(payload);

      const response = await request(app.getHttpServer())
        .post('/document-types')
        .send(payload)
        .expect(409);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'Já existe um tipo de documento com este nome.',
        ]),
      );
    });
  });

  describe('/document-types (GET)', () => {
    it('deve listar tipos com paginação', async () => {
      await request(app.getHttpServer())
        .post('/document-types')
        .send({ name: 'ASO', description: 'Desc 1' });
      await request(app.getHttpServer())
        .post('/document-types')
        .send({ name: 'CPF', description: 'Desc 2' });

      const response = await request(app.getHttpServer())
        .get('/document-types')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(2);
    });
  });

  describe('/document-types/:id (DELETE)', () => {
    it('deve realizar soft delete e retornar HTTP 204', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/document-types')
        .send({ name: 'A_DELETAR', description: 'Desc' });

      const id = createRes.body.id;

      await request(app.getHttpServer())
        .delete(`/document-types/${id}`)
        .expect(204);

      const listRes = await request(app.getHttpServer()).get('/document-types');
      expect(listRes.body.data).toHaveLength(0);
    });
  });
});
