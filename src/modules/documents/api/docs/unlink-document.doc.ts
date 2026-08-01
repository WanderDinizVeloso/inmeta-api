import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiDocsUnlinkDocument() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Remove a obrigatoriedade de um documento para um colaborador (Soft Delete)',
    }),
    ApiParam({
      name: 'id',
      format: 'uuid',
      description: 'ID da vinculação (Requirement)',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Desvinculado com sucesso',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vinculação não encontrada',
    }),
  );
}
