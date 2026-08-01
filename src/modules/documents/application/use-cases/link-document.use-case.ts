import { Injectable, ConflictException } from '@nestjs/common';
import { RequirementRepository } from '../../infra/repositories/requirement.repository';
import { Requirement } from '../../domain/requirement.entity';
import { LinkDocumentDto } from '../../api/dtos/link-document.dto';

@Injectable()
export class LinkDocumentUseCase {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async execute({
    employeeId,
    documentTypeId,
  }: LinkDocumentDto): Promise<Requirement> {
    const existing = await this.requirementRepository.findByEmployeeAndType({
      employeeId,
      documentTypeId,
    });

    if (existing) {
      throw new ConflictException(
        'Este documento já está vinculado a este colaborador como obrigatório.',
      );
    }

    const requirement = Requirement.create({ employeeId, documentTypeId });

    await this.requirementRepository.save({ requirement });

    return requirement;
  }
}
