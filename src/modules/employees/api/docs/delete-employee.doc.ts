import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiDocsSoftDeleteEmployee() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remove um colaborador logicamente (Soft Delete)',
    }),
    ApiParam({ name: 'id', format: 'uuid', description: 'ID do colaborador' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Colaborador removido com sucesso',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Colaborador não encontrado',
    }),
  );
}
