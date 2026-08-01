import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LinkDocumentUseCase } from '../../application/use-cases/link-document.use-case';
import { UnlinkDocumentUseCase } from '../../application/use-cases/unlink-document.use-case';
import { SubmitDocumentUseCase } from '../../application/use-cases/submit-document.use-case';
import { LinkDocumentDto } from '../dtos/link-document.dto';
import { SubmitDocumentDto } from '../dtos/submit-document.dto';
import { ApiDocsLinkDocument } from '../docs/link-document.doc';
import { ApiDocsUnlinkDocument } from '../docs/unlink-document.doc';
import { ApiDocsSubmitDocument } from '../docs/submit-document.doc';

@ApiTags('Documentos (Vinculações e Envios)')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly linkDocumentUseCase: LinkDocumentUseCase,
    private readonly unlinkDocumentUseCase: UnlinkDocumentUseCase,
    private readonly submitDocumentUseCase: SubmitDocumentUseCase,
  ) {}

  @Post('requirements')
  @HttpCode(HttpStatus.CREATED)
  @ApiDocsLinkDocument()
  async linkRequirement(@Body() dto: LinkDocumentDto) {
    const requirement = await this.linkDocumentUseCase.execute(dto);
    return {
      id: requirement.id,
      employeeId: requirement.employeeId,
      documentTypeId: requirement.documentTypeId,
      createdAt: requirement.createdAt,
    };
  }

  @Delete('requirements/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocsUnlinkDocument()
  async unlinkRequirement(@Param('id', ParseUUIDPipe) id: string) {
    await this.unlinkDocumentUseCase.execute({ id });
  }

  @Post('submissions')
  @HttpCode(HttpStatus.CREATED)
  @ApiDocsSubmitDocument()
  async submitDocument(@Body() dto: SubmitDocumentDto) {
    const submission = await this.submitDocumentUseCase.execute(dto);
    return {
      id: submission.id,
      requirementId: submission.requirementId,
      logicalUrl: submission.logicalUrl,
      version: submission.version,
      isActive: submission.isActive,
      createdAt: submission.createdAt,
    };
  }
}
