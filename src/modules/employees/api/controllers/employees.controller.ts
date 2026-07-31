import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.use-case';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeResponseDto } from '../dtos/employee-response.dto';
import { ApiDocsCreateEmployee } from '../docs/create-employee.doc';
import { ListEmployeesUseCase } from '../../application/use-cases/list-employees.use-case';
import { ApiDocsListEmployees } from '../docs/list-employees.doc';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination-query.dto';
import { ApiDocsSoftDeleteEmployee } from '../docs/delete-employee.doc';
import { SoftDeleteEmployeeUseCase } from '../../application/use-cases/soft-delete-employee.use-case';

@ApiTags('Colaboradores')
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly listEmployeesUseCase: ListEmployeesUseCase,
    private readonly softDeleteEmployeeUseCase: SoftDeleteEmployeeUseCase,
  ) {}

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

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiDocsListEmployees()
  async findAll(@Query() query: PaginationQueryDto) {
    return this.listEmployeesUseCase.execute(query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocsSoftDeleteEmployee()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.softDeleteEmployeeUseCase.execute({ id });
  }
}
