import { Injectable, ConflictException } from '@nestjs/common';
import { DocumentTypeRepository } from '../../infra/repositories/document-type.repository';
import { DocumentType } from '../../domain/document-type.entity';
import { CreateDocumentTypeDto } from '../../api/dtos/create-document-type.dto';

@Injectable()
export class CreateDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async execute({
    name,
    description,
  }: CreateDocumentTypeDto): Promise<DocumentType> {
    const existingType = await this.documentTypeRepository.findByName({ name });

    if (existingType) {
      throw new ConflictException(
        'Já existe um tipo de documento com este nome.',
      );
    }

    const documentType = DocumentType.create({ name, description });

    await this.documentTypeRepository.save({ documentType });

    return documentType;
  }
}
