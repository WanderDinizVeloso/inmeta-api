import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { EmployeeResponseDto } from '../dtos/employee-response.dto';

export function ApiDocsCreateEmployee() {
  return applyDecorators(
    ApiOperation({ summary: 'Cadastra um novo colaborador' }),
    ApiCreatedResponse({
      description: 'Colaborador criado com sucesso',
      type: EmployeeResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Já existe um colaborador cadastrado com este e-mail.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Erro de validação (Payload inválido).',
    }),
  );
}
