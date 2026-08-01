import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { LatestSubmissionResponseDto } from '../dtos/latest-submission-response.dto';

export function ApiDocsGetLatestSubmissions() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna a lista dos últimos documentos enviados no sistema',
    }),
    ApiOkResponse({
      description: 'Lista retornada com sucesso',
      type: [LatestSubmissionResponseDto],
    }),
  );
}
