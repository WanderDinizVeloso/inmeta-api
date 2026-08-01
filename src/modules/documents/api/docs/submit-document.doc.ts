import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';

export function ApiDocsSubmitDocument() {
  return applyDecorators(
    ApiOperation({
      summary: 'Envia um documento (Cria uma nova versão e inativa a anterior)',
    }),
    ApiCreatedResponse({ description: 'Envio realizado com sucesso' }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Obrigatoriedade não encontrada',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description:
        'Conflito de concorrência: Um reenvio já está em processamento',
    }),
  );
}
