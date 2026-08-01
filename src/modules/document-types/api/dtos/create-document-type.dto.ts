import {
  PropertyString,
  PropertyStringOptional,
} from '../../../../shared/decorators/property.decorators';

export class CreateDocumentTypeDto {
  @PropertyString({ description: 'Nome do tipo de documento', example: 'ASO' })
  name!: string;

  @PropertyStringOptional({
    description: 'Descrição detalhada do documento',
    example: 'Atestado de Saúde Ocupacional Admissional',
  })
  description!: string;
}
