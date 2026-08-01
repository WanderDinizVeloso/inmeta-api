import { Module } from '@nestjs/common';
import { DashboardController } from './api/controllers/dashboard.controller';
import { DashboardRepository } from './infra/repositories/dashboard.repository';
import { GetDashboardStatsUseCase } from './application/use-cases/get-dashboard-stats.use-case';
import { GetLatestSubmissionsUseCase } from './application/use-cases/get-latest-submissions.use-case';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardRepository,
    GetDashboardStatsUseCase,
    GetLatestSubmissionsUseCase,
  ],
})
export class DashboardModule {}
