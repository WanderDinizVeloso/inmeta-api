import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/prisma/prisma.service';
import { Employee } from '../../domain/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById({ id }: { id: string }): Promise<Employee | null> {
    const data = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt !== null) {
      return null;
    }

    return Employee.create(data);
  }

  async findByEmail({ email }: { email: string }): Promise<Employee | null> {
    const data = await this.prisma.employee.findUnique({
      where: { email },
    });

    if (!data || data.deletedAt !== null) {
      return null;
    }

    return Employee.create(data);
  }

  async save({ employee }: { employee: Employee }): Promise<void> {
    await this.prisma.employee.create({
      data: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
        deletedAt: employee.deletedAt,
      },
    });
  }

  async findAll({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }): Promise<{ items: Employee[]; total: number }> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      items: data.map((row) => Employee.create(row)),
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
    await this.prisma.employee.update({
      where: { id },
      data: { deletedAt },
    });
  }
}
