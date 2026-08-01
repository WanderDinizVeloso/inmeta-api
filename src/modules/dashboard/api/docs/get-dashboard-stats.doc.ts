import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { DashboardStatsResponseDto } from '../dtos/dashboard-stats-response.dto';

export function ApiDocsGetDashboardStats() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Retorna estatísticas globais de compliance (Percentual e Tipos mais pendentes)',
    }),
    ApiOkResponse({
      description: 'Estatísticas geradas com sucesso',
      type: DashboardStatsResponseDto,
    }),
  );
}
