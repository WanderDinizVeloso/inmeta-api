import { Injectable, NotFoundException } from '@nestjs/common';
import { RequirementRepository } from '../../infra/repositories/requirement.repository';

@Injectable()
export class UnlinkDocumentUseCase {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async execute({ id }: { id: string }): Promise<void> {
    const requirement = await this.requirementRepository.findById({ id });

    if (!requirement) {
      throw new NotFoundException('Vinculação não encontrada ou já removida.');
    }

    await this.requirementRepository.softDelete({ id, deletedAt: new Date() });
  }
}
