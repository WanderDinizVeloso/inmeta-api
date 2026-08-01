import { Injectable, NotFoundException } from '@nestjs/common';
import { RequirementRepository } from '../../infra/repositories/requirement.repository';
import { SubmissionRepository } from '../../infra/repositories/submission.repository';
import { Submission } from '../../domain/submission.entity';
import { SubmitDocumentDto } from '../../api/dtos/submit-document.dto';

@Injectable()
export class SubmitDocumentUseCase {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly submissionRepository: SubmissionRepository,
  ) {}

  async execute({
    requirementId,
    logicalUrl,
  }: SubmitDocumentDto): Promise<Submission> {
    const requirement = await this.requirementRepository.findById({
      id: requirementId,
    });

    if (!requirement) {
      throw new NotFoundException(
        'Vinculação documental não encontrada ou removida.',
      );
    }

    const currentSubmission =
      await this.submissionRepository.findActiveByRequirementId({
        requirementId,
      });

    const nextVersion = currentSubmission ? currentSubmission.version + 1 : 1;

    const newSubmission = Submission.create({
      requirementId,
      logicalUrl,
      version: nextVersion,
      isActive: true,
    });

    await this.submissionRepository.saveNewVersion({
      newSubmission,
      oldSubmissionId: currentSubmission?.id,
    });

    return newSubmission;
  }
}
