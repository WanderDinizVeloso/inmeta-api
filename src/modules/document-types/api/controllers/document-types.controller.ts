import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDocumentTypeUseCase } from '../../application/use-cases/create-document-type.use-case';
import { ListDocumentTypesUseCase } from '../../application/use-cases/list-document-types.use-case';
import { SoftDeleteDocumentTypeUseCase } from '../../application/use-cases/soft-delete-document-type.use-case';
import { CreateDocumentTypeDto } from '../dtos/create-document-type.dto';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination-query.dto';
import { ApiDocsCreateDocumentType } from '../docs/create-document-type.doc';
import { ApiDocsListDocumentTypes } from '../docs/list-document-types.doc';
import { ApiDocsSoftDeleteDocumentType } from '../docs/delete-document-type.doc';

@ApiTags('Tipos de Documentos')
@Controller('document-types')
export class DocumentTypesController {
  constructor(
    private readonly createDocumentTypeUseCase: CreateDocumentTypeUseCase,
    private readonly listDocumentTypesUseCase: ListDocumentTypesUseCase,
    private readonly softDeleteDocumentTypeUseCase: SoftDeleteDocumentTypeUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiDocsCreateDocumentType()
  async create(@Body() dto: CreateDocumentTypeDto) {
    const docType = await this.createDocumentTypeUseCase.execute(dto);
    return {
      id: docType.id,
      name: docType.name,
      description: docType.description,
      createdAt: docType.createdAt,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiDocsListDocumentTypes()
  async findAll(@Query() query: PaginationQueryDto) {
    return this.listDocumentTypesUseCase.execute(query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocsSoftDeleteDocumentType()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.softDeleteDocumentTypeUseCase.execute({ id });
  }
}
