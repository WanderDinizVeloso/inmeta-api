import { Injectable } from '@nestjs/common';
import { DocumentTypeRepository } from '../../infra/repositories/document-type.repository';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination-query.dto';

@Injectable()
export class ListDocumentTypesUseCase {
  constructor(
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async execute({ page = 1, limit = 10 }: PaginationQueryDto) {
    const skip = (page - 1) * limit;

    const { items, total } = await this.documentTypeRepository.findAll({
      skip,
      take: limit,
    });

    return {
      data: items.map((type) => ({
        id: type.id,
        name: type.name,
        description: type.description,
        createdAt: type.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
