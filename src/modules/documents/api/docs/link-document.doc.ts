import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';

export function ApiDocsLinkDocument() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Vincula um tipo de documento como obrigatório para um colaborador',
    }),
    ApiCreatedResponse({ description: 'Vinculação criada com sucesso' }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Documento já vinculado ao colaborador',
    }),
  );
}
