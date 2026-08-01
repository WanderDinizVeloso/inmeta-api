import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

export function ApiDocsListEmployees() {
  return applyDecorators(
    ApiOperation({ summary: 'Lista os colaboradores de forma paginada' }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
    ApiOkResponse({ description: 'Lista retornada com sucesso' }),
  );
}
