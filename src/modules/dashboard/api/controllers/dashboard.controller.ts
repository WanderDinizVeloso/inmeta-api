import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.use-case';
import { GetLatestSubmissionsUseCase } from '../../application/use-cases/get-latest-submissions.use-case';
import { GetLatestQueryDto } from '../dtos/get-latest-query.dto';
import { ApiDocsGetDashboardStats } from '../docs/get-dashboard-stats.doc';
import { ApiDocsGetLatestSubmissions } from '../docs/get-latest-submissions.doc';

@ApiTags('Dashboard e Estatísticas')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private readonly getLatestSubmissionsUseCase: GetLatestSubmissionsUseCase,
  ) {}

  @Get('stats')
  @ApiDocsGetDashboardStats()
  async getStats() {
    return this.getDashboardStatsUseCase.execute();
  }

  @Get('latest-submissions')
  @ApiDocsGetLatestSubmissions()
  async getLatestSubmissions(@Query() query: GetLatestQueryDto) {
    return this.getLatestSubmissionsUseCase.execute({ limit: query.limit });
  }
}
