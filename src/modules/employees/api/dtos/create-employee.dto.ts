import {
  PropertyString,
  PropertyEmail,
} from '../../../../shared/decorators/property.decorators';

export class CreateEmployeeDto {
  @PropertyString({
    description: 'Nome completo do colaborador',
    example: 'João Silva',
  })
  name!: string;

  @PropertyEmail({
    description: 'E-mail corporativo ou pessoal',
    example: 'joao.silva@inmeta.com',
  })
  email!: string;
}
