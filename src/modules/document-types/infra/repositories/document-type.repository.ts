import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/prisma/prisma.service';
import { DocumentType } from '../../domain/document-type.entity';

@Injectable()
export class DocumentTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName({ name }: { name: string }): Promise<DocumentType | null> {
    const data = await this.prisma.documentType.findUnique({
      where: { name },
    });

    if (!data || data.deletedAt !== null) {
      return null;
    }

    return DocumentType.create(data);
  }

  async findById({ id }: { id: string }): Promise<DocumentType | null> {
    const data = await this.prisma.documentType.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt !== null) {
      return null;
    }

    return DocumentType.create(data);
  }

  async save({ documentType }: { documentType: DocumentType }): Promise<void> {
    await this.prisma.documentType.create({
      data: {
        id: documentType.id,
        name: documentType.name,
        description: documentType.description,
        createdAt: documentType.createdAt,
        updatedAt: documentType.updatedAt,
        deletedAt: documentType.deletedAt,
      },
    });
  }

  async findAll({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }): Promise<{ items: DocumentType[]; total: number }> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.documentType.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.documentType.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      items: data.map((row) => DocumentType.create(row)),
      total,
    };
  }

  async softDelete({
    id,
    deletedAt,
  }: {
    id: string;
    deletedAt: Date;
  }): Promise<void> {
    await this.prisma.documentType.update({
      where: { id },
      data: { deletedAt },
    });
  }
}
