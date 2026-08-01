import {
  PropertyString,
  PropertyUUID,
} from '../../../../shared/decorators/property.decorators';

export class SubmitDocumentDto {
  @PropertyUUID({ description: 'ID da vinculação (Requirement)' })
  requirementId!: string;

  @PropertyString({
    description: 'URL ou caminho lógico do arquivo armazenado',
    example: 'https://s3.aws.com/bucket/doc.pdf',
  })
  logicalUrl!: string;
}
