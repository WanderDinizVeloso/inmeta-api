import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.use-case';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeResponseDto } from '../dtos/employee-response.dto';
import { ApiDocsCreateEmployee } from '../docs/create-employee.doc';

@ApiTags('Colaboradores')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiDocsCreateEmployee()
  async create(@Body() dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.createEmployeeUseCase.execute(dto);

    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      createdAt: employee.createdAt,
    };
  }
}
