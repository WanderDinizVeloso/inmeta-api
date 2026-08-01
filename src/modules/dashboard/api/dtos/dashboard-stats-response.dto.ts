import { ApiProperty } from '@nestjs/swagger';

export class PendingDocumentTypeDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  documentTypeId!: string;

  @ApiProperty({ example: 'ASO' })
  name!: string;

  @ApiProperty({
    example: 45,
    description: 'Quantidade de colaboradores com este documento pendente',
  })
  pendingCount!: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty({
    example: 85.5,
    description: 'Percentual de completude global (0 a 100)',
  })
  globalCompliancePercentage!: number;

  @ApiProperty({
    type: [PendingDocumentTypeDto],
    description: 'Top tipos de documentos mais pendentes',
  })
  mostPendingTypes!: PendingDocumentTypeDto[];
}
