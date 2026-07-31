import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { DocumentTypeResponseDto } from '../dtos/document-type-response.dto';

export function ApiDocsCreateDocumentType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastra um novo tipo de documento (ex: CPF, ASO)',
    }),
    ApiCreatedResponse({
      description: 'Tipo de documento criado com sucesso',
      type: DocumentTypeResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Já existe um tipo de documento com este nome.',
    }),
  );
}
