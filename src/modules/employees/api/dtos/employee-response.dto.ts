import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id!: string;

  @ApiProperty({ example: 'João Silva' })
  name!: string;

  @ApiProperty({ example: 'joao.silva@inmeta.com' })
  email!: string;

  @ApiProperty({ example: '2026-07-29T20:00:00.000Z' })
  createdAt!: Date;
}
