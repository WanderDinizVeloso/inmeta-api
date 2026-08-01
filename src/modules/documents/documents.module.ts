import { Module } from '@nestjs/common';
import { DocumentsController } from './api/controllers/documents.controller';
import { RequirementRepository } from './infra/repositories/requirement.repository';
import { SubmissionRepository } from './infra/repositories/submission.repository';
import { LinkDocumentUseCase } from './application/use-cases/link-document.use-case';
import { UnlinkDocumentUseCase } from './application/use-cases/unlink-document.use-case';
import { SubmitDocumentUseCase } from './application/use-cases/submit-document.use-case';

@Module({
  controllers: [DocumentsController],
  providers: [
    RequirementRepository,
    SubmissionRepository,
    LinkDocumentUseCase,
    UnlinkDocumentUseCase,
    SubmitDocumentUseCase,
  ],
})
export class DocumentsModule {}
