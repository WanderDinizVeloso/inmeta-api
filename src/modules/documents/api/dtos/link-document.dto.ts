import { PropertyUUID } from '../../../../shared/decorators/property.decorators';

export class LinkDocumentDto {
  @PropertyUUID({ description: 'ID do Colaborador' })
  employeeId!: string;

  @PropertyUUID({ description: 'ID do Tipo de Documento (ex: ASO, CPF)' })
  documentTypeId!: string;
}
