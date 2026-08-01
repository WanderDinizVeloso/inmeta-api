import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';

@Injectable()
export class SoftDeleteEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute({ id }: { id: string }): Promise<void> {
    const employee = await this.employeeRepository.findById({ id });

    if (!employee) {
      throw new NotFoundException('Colaborador não encontrado ou já removido.');
    }

    await this.employeeRepository.softDelete({ id, deletedAt: new Date() });
  }
}
