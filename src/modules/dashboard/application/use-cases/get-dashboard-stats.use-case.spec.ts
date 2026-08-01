import { GetDashboardStatsUseCase } from './get-dashboard-stats.use-case';
import { DashboardRepository } from '../../infra/repositories/dashboard.repository';

describe('GetDashboardStatsUseCase', () => {
  let useCase: GetDashboardStatsUseCase;
  let repository: jest.Mocked<DashboardRepository>;

  beforeEach(() => {
    repository = {
      getComplianceCounts: jest.fn(),
      getMostPendingDocumentTypes: jest.fn(),
      getLatestSubmissions: jest.fn(),
    } as unknown as jest.Mocked<DashboardRepository>;

    useCase = new GetDashboardStatsUseCase(repository);
  });

  it('deve calcular 100% de completude corretamente', async () => {
    repository.getComplianceCounts.mockResolvedValue({
      totalRequirements: 10,
      completedRequirements: 10,
    });
    repository.getMostPendingDocumentTypes.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.globalCompliancePercentage).toBe(100);
    expect(result.mostPendingTypes).toEqual([]);
  });

  it('deve lidar com divisão por zero (sem obrigações)', async () => {
    repository.getComplianceCounts.mockResolvedValue({
      totalRequirements: 0,
      completedRequirements: 0,
    });
    repository.getMostPendingDocumentTypes.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.globalCompliancePercentage).toBe(0);
  });
});
