import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../../infra/repositories/dashboard.repository';
import { LatestSubmissionResponseDto } from '../../api/dtos/latest-submission-response.dto';

@Injectable()
export class GetLatestSubmissionsUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute({
    limit = 10,
  }: {
    limit?: number;
  }): Promise<LatestSubmissionResponseDto[]> {
    const submissions = await this.dashboardRepository.getLatestSubmissions({
      limit,
    });

    return submissions.map((sub) => ({
      submissionId: sub.id,
      employeeName: sub.requirement.employee.name,
      documentTypeName: sub.requirement.documentType.name,
      logicalUrl: sub.logicalUrl,
      version: sub.version,
      submittedAt: sub.createdAt,
    }));
  }
}
