import { GetLatestSubmissionsUseCase } from './get-latest-submissions.use-case';
import { DashboardRepository } from '../../infra/repositories/dashboard.repository';

describe('GetLatestSubmissionsUseCase', () => {
  let useCase: GetLatestSubmissionsUseCase;
  let repository: jest.Mocked<DashboardRepository>;

  beforeEach(() => {
    repository = {
      getLatestSubmissions: jest.fn(),
    } as unknown as jest.Mocked<DashboardRepository>;

    useCase = new GetLatestSubmissionsUseCase(repository);
  });

  it('deve formatar a saída plana corretamente', async () => {
    const mockOrmData = [
      {
        id: 'sub-1',
        logicalUrl: 'doc.pdf',
        version: 1,
        createdAt: new Date('2026-07-31T00:00:00Z'),
        requirement: {
          employee: { name: 'João' },
          documentType: { name: 'ASO' },
        },
      },
    ] as any;

    repository.getLatestSubmissions.mockResolvedValue(mockOrmData);

    const result = await useCase.execute({ limit: 5 });

    expect(result).toHaveLength(1);
    expect(result[0].employeeName).toBe('João');
    expect(result[0].documentTypeName).toBe('ASO');
    expect(repository.getLatestSubmissions).toHaveBeenCalledWith({ limit: 5 });
  });
});
