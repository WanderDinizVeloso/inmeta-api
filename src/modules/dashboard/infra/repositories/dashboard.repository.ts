import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getComplianceCounts(): Promise<{
    totalRequirements: number;
    completedRequirements: number;
  }> {
    const [totalRequirements, completedRequirements] =
      await this.prisma.$transaction([
        this.prisma.employeeDocumentRequirement.count({
          where: { deletedAt: null },
        }),
        this.prisma.employeeDocumentRequirement.count({
          where: {
            deletedAt: null,
            submissions: { some: { isActive: true } },
          },
        }),
      ]);

    return { totalRequirements, completedRequirements };
  }

  async getMostPendingDocumentTypes({ limit }: { limit: number }) {
    const grouped = await this.prisma.employeeDocumentRequirement.groupBy({
      by: ['documentTypeId'],
      where: {
        deletedAt: null,
        submissions: { none: { isActive: true } },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) return [];

    const typeIds = grouped.map((group) => group.documentTypeId);
    const documentTypes = await this.prisma.documentType.findMany({
      where: { id: { in: typeIds } },
      select: { id: true, name: true },
    });

    return grouped.map((group) => {
      const docType = documentTypes.find(
        (documentType) => documentType.id === group.documentTypeId,
      );

      return {
        documentTypeId: group.documentTypeId,
        name: docType?.name || 'Desconhecido',
        pendingCount: group._count.id,
      };
    });
  }

  async getLatestSubmissions({ limit }: { limit: number }) {
    return this.prisma.documentSubmission.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        requirement: {
          include: {
            employee: { select: { name: true } },
            documentType: { select: { name: true } },
          },
        },
      },
    });
  }
}
