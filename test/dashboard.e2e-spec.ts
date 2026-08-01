import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/infra/prisma/prisma.service';
import { AllExceptionsFilter } from './../src/shared/filters/all-exceptions.filter';
import { randomUUID } from 'node:crypto';

describe('DashboardController (e2e)', () => {
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
    await prisma.employee.deleteMany();
    await prisma.documentType.deleteMany();

    const emp1 = randomUUID();
    const emp2 = randomUUID();
    const docType1 = randomUUID();
    const docType2 = randomUUID();

    await prisma.employee.createMany({
      data: [
        {
          id: emp1,
          name: 'João',
          email: 'joao@test.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: emp2,
          name: 'Maria',
          email: 'maria@test.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
    await prisma.documentType.createMany({
      data: [
        {
          id: docType1,
          name: 'ASO',
          description: 'Médico',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: docType2,
          name: 'CPF',
          description: 'Documento',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const req1 = randomUUID();
    const req2 = randomUUID();
    const req3 = randomUUID();

    await prisma.employeeDocumentRequirement.createMany({
      data: [
        {
          id: req1,
          employeeId: emp1,
          documentTypeId: docType1,
          createdAt: new Date(),
        },
        {
          id: req2,
          employeeId: emp1,
          documentTypeId: docType2,
          createdAt: new Date(),
        },
        {
          id: req3,
          employeeId: emp2,
          documentTypeId: docType2,
          createdAt: new Date(),
        },
      ],
    });

    await prisma.documentSubmission.create({
      data: {
        id: randomUUID(),
        requirementId: req1,
        logicalUrl: 'https://aws.com/aso-joao.pdf',
        version: 1,
        isActive: true,
        createdAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/dashboard/stats (GET)', () => {
    it('deve retornar 33.33% de completude (1 concluído de 3 obrigações)', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboard/stats')
        .expect(200);

      expect(response.body.globalCompliancePercentage).toBe(33.33);

      const topPending = response.body.mostPendingTypes[0];
      expect(topPending.name).toBe('CPF');
      expect(topPending.pendingCount).toBe(2);
    });
  });

  describe('/dashboard/latest-submissions (GET)', () => {
    it('deve retornar a lista formatada dos últimos envios', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboard/latest-submissions?limit=5')
        .expect(200);

      expect(response.body).toHaveLength(1);

      const sub = response.body[0];
      expect(sub.employeeName).toBe('João');
      expect(sub.documentTypeName).toBe('ASO');
      expect(sub.logicalUrl).toBe('https://aws.com/aso-joao.pdf');
      expect(sub.version).toBe(1);
    });
  });
});
