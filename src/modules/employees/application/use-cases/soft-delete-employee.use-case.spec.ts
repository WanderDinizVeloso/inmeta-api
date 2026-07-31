import { SoftDeleteEmployeeUseCase } from './soft-delete-employee.use-case';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { Employee } from '../../domain/employee.entity';
import { NotFoundException } from '@nestjs/common';

describe('SoftDeleteEmployeeUseCase', () => {
  let useCase: SoftDeleteEmployeeUseCase;
  let repository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<EmployeeRepository>;

    useCase = new SoftDeleteEmployeeUseCase(repository);
  });

  it('deve realizar o soft delete com sucesso', async () => {
    const mockEmployee = Employee.create({
      name: 'Wander',
      email: 'wander@inmeta.com',
    });
    repository.findById.mockResolvedValue(mockEmployee);

    await useCase.execute({ id: mockEmployee.id });

    expect(repository.findById).toHaveBeenCalledWith({ id: mockEmployee.id });
    expect(repository.softDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockEmployee.id,
        deletedAt: expect.any(Date),
      }),
    );
  });

  it('deve lançar NotFoundException se o colaborador não existir', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'uuid-invalido' })).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
