import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentTypeRepository } from '../../infra/repositories/document-type.repository';

@Injectable()
export class SoftDeleteDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async execute({ id }: { id: string }): Promise<void> {
    const documentType = await this.documentTypeRepository.findById({ id });

    if (!documentType) {
      throw new NotFoundException(
        'Tipo de documento não encontrado ou já removido.',
      );
    }

    await this.documentTypeRepository.softDelete({ id, deletedAt: new Date() });
  }
}
