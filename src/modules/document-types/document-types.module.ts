import { Module } from '@nestjs/common';
import { DocumentTypesController } from './api/controllers/document-types.controller';
import { CreateDocumentTypeUseCase } from './application/use-cases/create-document-type.use-case';
import { ListDocumentTypesUseCase } from './application/use-cases/list-document-types.use-case';
import { SoftDeleteDocumentTypeUseCase } from './application/use-cases/soft-delete-document-type.use-case';
import { DocumentTypeRepository } from './infra/repositories/document-type.repository';

@Module({
  controllers: [DocumentTypesController],
  providers: [
    DocumentTypeRepository,
    CreateDocumentTypeUseCase,
    ListDocumentTypesUseCase,
    SoftDeleteDocumentTypeUseCase,
  ],
})
export class DocumentTypesModule {}
