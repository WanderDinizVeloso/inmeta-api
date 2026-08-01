import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/prisma/prisma.service';
import { Requirement } from '../../domain/requirement.entity';

@Injectable()
export class RequirementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmployeeAndType({
    employeeId,
    documentTypeId,
  }: {
    employeeId: string;
    documentTypeId: string;
  }): Promise<Requirement | null> {
    const data = await this.prisma.employeeDocumentRequirement.findFirst({
      where: { employeeId, documentTypeId, deletedAt: null },
    });

    if (!data) return null;

    return Requirement.create(data);
  }

  async findById({ id }: { id: string }): Promise<Requirement | null> {
    const data = await this.prisma.employeeDocumentRequirement.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt !== null) return null;

    return Requirement.create(data);
  }

  async save({ requirement }: { requirement: Requirement }): Promise<void> {
    await this.prisma.employeeDocumentRequirement.create({
      data: {
        id: requirement.id,
        employeeId: requirement.employeeId,
        documentTypeId: requirement.documentTypeId,
        createdAt: requirement.createdAt,
        deletedAt: requirement.deletedAt,
      },
    });
  }

  async softDelete({
    id,
    deletedAt,
  }: {
    id: string;
    deletedAt: Date;
  }): Promise<void> {
    await this.prisma.employeeDocumentRequirement.update({
      where: { id },
      data: { deletedAt },
    });
  }
}
