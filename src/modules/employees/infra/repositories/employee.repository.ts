import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/prisma/prisma.service';
import { Employee } from '../../domain/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
