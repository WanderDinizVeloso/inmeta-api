import { ApiProperty } from '@nestjs/swagger';

export class LatestSubmissionResponseDto {
  @ApiProperty({ format: 'uuid' })
  submissionId!: string;

  @ApiProperty()
  employeeName!: string;

  @ApiProperty()
  documentTypeName!: string;

  @ApiProperty()
  logicalUrl!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  submittedAt!: Date;
}
