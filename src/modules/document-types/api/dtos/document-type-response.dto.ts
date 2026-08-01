import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentTypeResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({ example: 'ASO' })
  name!: string;

  @ApiPropertyOptional({ example: 'Atestado de Saúde Ocupacional Admissional' })
  description?: string;

  @ApiProperty({ example: '2026-07-31T20:00:00.000Z' })
  createdAt!: Date;
}
