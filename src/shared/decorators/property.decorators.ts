import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export function PropertyString(options: ApiPropertyOptions) {
  return applyDecorators(
    ApiProperty(options),
    IsString({ message: `${options.description} deve ser um texto válido.` }),
    IsNotEmpty({ message: `${options.description} é obrigatório.` }),
  );
}

export function PropertyEmail(options: ApiPropertyOptions) {
  return applyDecorators(
    ApiProperty(options),
    IsEmail({}, { message: 'O e-mail fornecido é inválido.' }),
    IsNotEmpty({ message: 'O e-mail é obrigatório.' }),
  );
}

export function PropertyUUID(options: ApiPropertyOptions) {
  return applyDecorators(
    ApiProperty({ format: 'uuid', ...options }),
    IsUUID('4', {
      message: `${options.description} deve ser um UUID v4 válido.`,
    }),
    IsNotEmpty({ message: `${options.description} é obrigatório.` }),
  );
}
