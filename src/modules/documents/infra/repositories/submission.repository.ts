import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/prisma/prisma.service';
import { Submission } from '../../domain/submission.entity';

@Injectable()
export class SubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveByRequirementId({
    requirementId,
  }: {
    requirementId: string;
  }): Promise<Submission | null> {
    const data = await this.prisma.documentSubmission.findFirst({
      where: { requirementId, isActive: true },
    });

    if (!data) return null;

    return Submission.create(data);
  }

  async saveNewVersion({
    newSubmission,
    oldSubmissionId,
  }: {
    newSubmission: Submission;
    oldSubmissionId?: string;
  }): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        if (oldSubmissionId) {
          await tx.documentSubmission.update({
            where: { id: oldSubmissionId },
            data: { isActive: false },
          });
        }

        await tx.documentSubmission.create({
          data: {
            id: newSubmission.id,
            requirementId: newSubmission.requirementId,
            logicalUrl: newSubmission.logicalUrl,
            version: newSubmission.version,
            isActive: newSubmission.isActive,
            createdAt: newSubmission.createdAt,
          },
        });
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Conflito de concorrência: Um reenvio para este documento já está sendo processado simultaneamente. Tente novamente.',
        );
      }

      throw error;
    }
  }
}
