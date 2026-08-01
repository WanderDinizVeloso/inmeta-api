import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/infra/prisma/prisma.service';
import { AllExceptionsFilter } from './../src/shared/filters/all-exceptions.filter';
import { SubmissionRepository } from './../src/modules/documents/infra/repositories/submission.repository';
import { randomUUID } from 'node:crypto';

describe('DocumentsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let employeeId: string;
  let documentTypeId: string;

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
    await prisma.employee.deleteMany();
    await prisma.documentType.deleteMany();

    employeeId = randomUUID();
    documentTypeId = randomUUID();

    await prisma.employee.create({
      data: {
        id: employeeId,
        name: 'João',
        email: 'joao.docs@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.documentType.create({
      data: {
        id: documentTypeId,
        name: 'CPF',
        description: 'Doc Federal',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Requirements (Vinculações)', () => {
    it('deve vincular um documento ao colaborador (HTTP 201) e rejeitar duplicidade (HTTP 409)', async () => {
      const payload = { employeeId, documentTypeId };

      const res = await request(app.getHttpServer())
        .post('/documents/requirements')
        .send(payload)
        .expect(201);
      expect(res.body).toHaveProperty('id');

      const conflictRes = await request(app.getHttpServer())
        .post('/documents/requirements')
        .send(payload)
        .expect(409);
      expect(conflictRes.body.message).toEqual(
        expect.arrayContaining([
          'Este documento já está vinculado a este colaborador como obrigatório.',
        ]),
      );
    });
  });

  describe('Submissions (Envios e CONCORRÊNCIA)', () => {
    it('CRÍTICO: Deve lidar com envios simultâneos barrando um deles HTTP 409)', async () => {
      const linkRes = await request(app.getHttpServer())
        .post('/documents/requirements')
        .send({ employeeId, documentTypeId });

      const requirementId = linkRes.body.id;
      const payload1 = { requirementId, logicalUrl: 'url-simultanea-1.pdf' };
      const payload2 = { requirementId, logicalUrl: 'url-simultanea-2.pdf' };

      const submissionRepo = app.get(SubmissionRepository);
      const originalFind =
        submissionRepo.findActiveByRequirementId.bind(submissionRepo);

      jest
        .spyOn(submissionRepo, 'findActiveByRequirementId')
        .mockImplementation(async (args) => {
          const result = await originalFind(args);
          await new Promise((resolve) => setTimeout(resolve, 50));
          return result;
        });

      const [response1, response2] = await Promise.all([
        request(app.getHttpServer())
          .post('/documents/submissions')
          .send(payload1),
        request(app.getHttpServer())
          .post('/documents/submissions')
          .send(payload2),
      ]);

      jest.restoreAllMocks();

      const statusCodes = [response1.status, response2.status];

      expect(statusCodes).toContain(201);
      expect(statusCodes).toContain(409);

      const failedResponse = response1.status === 409 ? response1 : response2;
      expect(failedResponse.body.message).toEqual(
        expect.arrayContaining([
          'Conflito de concorrência: Um reenvio para este documento já está sendo processado simultaneamente. Tente novamente.',
        ]),
      );
    });
  });
});
