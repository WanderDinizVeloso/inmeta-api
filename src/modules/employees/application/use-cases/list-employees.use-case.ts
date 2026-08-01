import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination-query.dto';

@Injectable()
export class ListEmployeesUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute({ page = 1, limit = 10 }: PaginationQueryDto) {
    const skip = (page - 1) * limit;

    const { items, total } = await this.employeeRepository.findAll({
      skip,
      take: limit,
    });

    return {
      data: items.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        createdAt: emp.createdAt,
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
