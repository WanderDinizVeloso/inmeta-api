import { Injectable, ConflictException } from '@nestjs/common';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { Employee } from '../../domain/employee.entity';
import { CreateEmployeeDto } from '../../api/dtos/create-employee.dto';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute({ name, email }: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepository.findByEmail({
      email,
    });

    if (existingEmployee) {
      throw new ConflictException(
        'Já existe um colaborador cadastrado com este e-mail.',
      );
    }

    const employee = Employee.create({ name, email });

    await this.employeeRepository.save({ employee });

    return employee;
  }
}
