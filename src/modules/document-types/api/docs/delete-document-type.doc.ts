import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiDocsSoftDeleteDocumentType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remove um tipo de documento logicamente (Soft Delete)',
    }),
    ApiParam({
      name: 'id',
      format: 'uuid',
      description: 'ID do tipo de documento',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Removido com sucesso',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Não encontrado',
    }),
  );
}
