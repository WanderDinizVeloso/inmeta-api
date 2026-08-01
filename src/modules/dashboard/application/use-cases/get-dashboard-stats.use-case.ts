import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../../infra/repositories/dashboard.repository';
import { DashboardStatsResponseDto } from '../../api/dtos/dashboard-stats-response.dto';

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(): Promise<DashboardStatsResponseDto> {
    const { totalRequirements, completedRequirements } =
      await this.dashboardRepository.getComplianceCounts();
    const mostPendingTypes =
      await this.dashboardRepository.getMostPendingDocumentTypes({ limit: 5 });

    let globalCompliancePercentage = 0;

    if (totalRequirements > 0) {
      globalCompliancePercentage =
        Math.round((completedRequirements / totalRequirements) * 10000) / 100;
    }

    return {
      globalCompliancePercentage,
      mostPendingTypes,
    };
  }
}
