import { CreateEmployeeUseCase } from './create-employee.use-case';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { ConflictException } from '@nestjs/common';
import { Employee } from '../../domain/employee.entity';

describe('CreateEmployeeUseCase', () => {
  let useCase: CreateEmployeeUseCase;
  let repository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<EmployeeRepository>;

    useCase = new CreateEmployeeUseCase(repository);
  });

  it('deve criar um colaborador com sucesso', async () => {
    repository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute({
      name: 'Wander',
      email: 'wander@inmeta.com',
    });

    expect(result).toBeInstanceOf(Employee);
    expect(result.id).toBeDefined();
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith({ employee: result });
  });

  it('deve lançar ConflictException (HTTP 409) se e-mail já existir', async () => {
    const mockEmployee = Employee.create({
      name: 'Wander',
      email: 'wander@inmeta.com',
    });

    repository.findByEmail.mockResolvedValue(mockEmployee);

    await expect(
      useCase.execute({ name: 'Wander Novo', email: 'wander@inmeta.com' }),
    ).rejects.toThrow(ConflictException);

    expect(repository.save).not.toHaveBeenCalled();
  });
});
