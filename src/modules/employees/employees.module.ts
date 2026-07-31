import { Module } from '@nestjs/common';
import { EmployeesController } from './api/controllers/employees.controller';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { EmployeeRepository } from './infra/repositories/employee.repository';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeeRepository, CreateEmployeeUseCase],
})
export class EmployeesModule {}
